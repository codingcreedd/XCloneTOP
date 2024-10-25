const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const verify = require('../config/verify').verify;
const prisma = new PrismaClient();
const multer = require('multer');
const axios = require('axios');

const storage = multer.memoryStorage();
const upload = multer({storage});

//send a message
router.post('/send', verify, upload.single("image"), async (req, res) => {
    try {
        const userId = req.user.id;
        const {chatId, description} = req.body;
        const file = req.file;

        let image = null;

        let messageObj = {
            description: description,
            userId,
            chatId: Number(chatId)
        }

        if(file) {
            const formData = new FormData();
            formData.append("image", file.buffer.toString("base64"));

            //upload to imageBB
            const imageBBResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
                method: "POST",
                body: formData
            });

            const result = await imageBBResponse.json();
            if(result && result.data) {
                image = result.data.url;
                messageObj.imageUrl = image;
            }
            

        }
        


        //create the message first
        const createMessage = await prisma.message.create({
            data: messageObj,
            include: {
                User: true
            }
        });

        if(!createMessage)
            return res.status(400).json({message: 'Cannot create message', status: 'failure'});

        return res.status(201).json({message: 'Sent message successfully', status: 'success', message: createMessage, clientId: userId})

    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error: Cannot send message',
            status: 'failure'
        })
    }
});

//edit a message
router.put('/edit', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {newDescription, messageId} = req.body;

        const editMessage = await prisma.message.update({
            where: {id: messageId, userId},
            data: {
                description: newDescription
            }
        });

        if(!editMessage)
            return res.status(400).json({message: 'Could not edit message', status: 'failure'});

        return res.status(201).json({message: 'Edited message successfully', status: 'success'});

    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error: Cannot edit message',
            status: 'failure'
        })
    }
});

router.delete('/delete', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {messageId} = req.body;

        const deleteMessage = await prisma.message.delete({where: {id: messageId, userId}});

        if(!deleteMessage)
            return res.status(400).json({message: 'Could not delete message', status: 'failure'});

        return res.status(201).json({message: 'Deleted message successfully', status: 'success'});

    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error: Cannot delete message',
            status: 'failure'
        })
    }
});

module.exports = router;