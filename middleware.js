const jwt = require('jsonwebtoken');
/*
const secret = 'mysecretsword';
const withAuth = function (req, res, next) {
    const token = req.cookies.tokenlogin;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    }
    else {
        jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            res.status(401).send('Unauthorized: Invalid token');
        }
        else {
            req.mail = decoded.mail;
            next();
      }
    });
  }
}
*/

const withAuth = function (req, res, next) {
    const token = req.cookies['tokenlogin'];
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    }
    else {
        req.mail = token;
        next();
    }
}

module.exports = withAuth;