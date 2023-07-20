const jwt = require("jsonwebtoken");

const secretKey = "tunalad.bandcamp.com/music";

function generateToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

function verifyToken(token, options) {
    try {
        return jwt.verify(token, secretKey, options);
    } catch (err) {
        throw new Error("Invalid token");
    }
}

module.exports = { generateToken, verifyToken };
