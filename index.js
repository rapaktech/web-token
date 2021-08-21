// Require Express module
const express = require('express');

// Import global express function
const app = express();

// Require web token creator
const jwt = require('jsonwebtoken');

// Import middlewre
app.use(express.json());

// Require .env global variable
require('dotenv').config();

// app listening port
const port = process.env.PORT;


// Secret and expiry variables for encoding token
const secret = process.env.SECRET;
const expiry = process.env.EXPIRY;



// Create a token
app.post('/create', (req, res) => {
    const payload = {
        username: req.body.username,
        id: req.body.id,
    };

    // Sign token
    jwt.sign(payload, secret, { expiresIn: expiry }, (err, token) => {
        if (err) return res.status(500).json({ err });
        else return res.status(200).json({ token });
    });
});


// Decode a token
app.get('/decode', (req, res) => {
    // check for auth header
    if (!req.headers.authorization) return res.status(403)
        .json({ message: "Authentication is required. Please sign in first to access this page" });

    // Pick auth header
    const auth = req.headers.authorization;

    // extract token
    const splitHeader = auth.split(' ');
    const token = splitHeader[1];

    // decode
    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) return res.status(500).json({ err });
        else return res.status(200).json({ decodedToken });
    });
});


// Listening port
app.listen(port, () => console.log(`Server lanched at port ${port}`));