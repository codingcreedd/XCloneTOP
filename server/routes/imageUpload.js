const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const verify = require('../config/verify').verify;
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const axios = require('axios');

const imageBB_KEY = process.env.IMGBB_API_KEY;

const storage = multer.memoryStorage();
const upload = multer({ storage });

// router.post('/upload/:type', verify, upload.single('image'), async (req, res) => {
//     try {
//         if(!req.file)
//             return res.status(400).json({message: 'No file uploaded', status: 'failure'});

//             const formData = new FormData();
//             formData.append('image', req.file.buffer.toString('base64'));

//             const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imageBB_KEY}`, formData , {
//                 headers: formData.getHeaders(),
//             });
    
//             const imageUrl = response.data.data.url;

//             const {type} = req.params;
//             const {id} = req.body; //this can either be a post id, a user id (for pfp)

//             if(type === 'pfp') {
//                 const updatePfp = await prisma.user.update({
//                     where: {id},
//                     data: {
//                         pfpUrl: imageUrl
//                     }
//                 })

//                 if(!updatePfp)
//                     return res.status(400).json({message: 'Could not update pfp', status: 'failure'})

//                 return res.status(201).json({message: 'Updated pfp successfully', status: 'success', pfpUrl: imageUrl})

//             } else {

//             }
    
            
//             res.status(200).json({ imageUrl });
//     } catch(err) {
//         console.error(err);
//         return res.status(500).json({message: 'Internal Server Error: Could not upload image'});
//     }
// })

module.exports = router;