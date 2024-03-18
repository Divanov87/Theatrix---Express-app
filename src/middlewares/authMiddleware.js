const jwt = require('jsonwebtoken');
const { SECRET, SESSION_COOKIE_NAME } = require('../configs/envVariables');

exports.authHandler = (req, res, next) => {
    const token = req.cookies[SESSION_COOKIE_NAME];

    if (token) {
        jwt.verify(token, SECRET, ((err, decodedToken) => {
            if (err) {
                console.error(err.message);
                res.clearCookie(SESSION_COOKIE_NAME);
                return res.redirect('/auth/login');
            }
            req.user = decodedToken;
            res.locals.user = decodedToken;
            res.locals.isAdmin = decodedToken.role === 'admin';
            res.locals.isUser = decodedToken.role === 'user';
            res.locals.location = decodedToken.location;

            console.log(decodedToken)
            if (decodedToken.role == 'admin'){
                console.log('yes');


            } else if (decodedToken.role == 'user') {
                console.log('no');

            }
            return next();
        }));
    } else next();
}

exports.isAuth = (req, res, next) => {
    if (!req.user) return res.redirect('/auth/login');
    next();
}

exports.isGuest = (req, res, next) => {
    if (req.user) return res.redirect('/');
    next();
}



