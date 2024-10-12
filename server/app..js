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

app.use('/user', user);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is up and running on server ${port}`);
});

module.exports = app;