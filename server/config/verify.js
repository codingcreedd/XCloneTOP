const jwt = require('jsonwebtoken');
const secretKey = require('../config/jwtConfig');

const verify = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if(!authHeader) {
        console.log('Missing token')
        return res.status(401).json({message: "Unauthorized: Missing Token"});
    }

    const [bearer, token] = authHeader.split(" ");
    console.log('Bearer: ' + bearer)
    if(bearer !== "Bearer" || !token) {
        console.log('Invalid token')
        return res.status(401).json({message: "Invalid token format"})
    }

    jwt.verify(token, secretKey, (err, user) => {
        if(err) {
            return res.status(403).json({message: 'Forbidden: Invalid Token'});
        }

        req.user = user;
        next();
    })
}

module.exports.verify = verify;