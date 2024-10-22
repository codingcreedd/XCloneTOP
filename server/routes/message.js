const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const verify = require('../config/verify').verify;
const prisma = new PrismaClient();

//send a message
router.post('/send', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const {chatId, description, imageUrl} = req.body;

        let messageObj = {
            description: description,
            userId,
            chatId
        }

        if(imageUrl)
            messageObj.imageUrl = imageUrl;

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