const jwt = require("jsonwebtoken");

async function isAuthenticated(req, res, next) {
    try {
        const token = req.headers["Authorization"].split(" ")[1];
        const user = jwt.verify(token , "secret");
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json(err);
    }
}

module.exports = isAuthenticated;
