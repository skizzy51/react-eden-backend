const HTTPStatus = require('http-status')

function VerifyRoles(...roles) {
    const CheckRole = (req, res, next) => {
        if (!req.user) {
            res.status(HTTPStatus.UNAUTHORIZED).json({ message : "User not logged in"})
            return
        }
        if (!roles.includes(req.user.role)) {
            res.status(HTTPStatus.FORBIDDEN).json({ message : "User not allowed"})
            return
        }
        next()
    }
    return CheckRole
}

module.exports = VerifyRoles