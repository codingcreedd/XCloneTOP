const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey');

const generateToken = user => {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email
    }

    return jwt.sign(payload, secretKey, {expiresIn: '10d'})
}

module.exports = generateToken;