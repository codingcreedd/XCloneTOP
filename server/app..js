require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');


//middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Routes
const user = require('./routes/user');
const post = require('./routes/post');
const message = require('./routes/message');
const imageUpload = require('./routes/imageUpload');

app.use('/user', user);
app.use('/post', post);
app.use('/message', message);
app.use('/image', imageUpload);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is up and running on server ${port}`);
});

module.exports = app;