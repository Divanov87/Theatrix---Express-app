const router = require('express').Router();
const authService = require('../services/authService');
const { SESSION_COOKIE_NAME, ADMIN_IP_ADDRESS } = require('../configs/envVariables');
const { isAuth, isGuest } = require('../middlewares/authMiddleware');
const { getErr } = require('../utilities/errHelper');


// --------------------------------- LOGIN -----------------------------------------------

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login', { title: 'Login Page' })


});
router.post('/login', isGuest, async (req, res) => {
    console.log(req.body)
    const { username_email, password } = req.body;
    const userIp = req.ip.toString().replace('::ffff:', '');
    const role = req.socket.remoteAddress == ADMIN_IP_ADDRESS || userIp === "127.0.0.1" ? 'admin' : 'user';

    try {
        const user = await authService.login(username_email, password, userIp);
        const token = await authService.generateToken(user);

        res.cookie(SESSION_COOKIE_NAME, token, { httpOnly: true, secure: false, sameSite: 'lax' });
        res.redirect('/')

    } catch (err) {

        res.status(403).render('auth/login', { title: 'Login Page', username_email, error: getErr(err) });
    }
});


// --------------------------------- REGISTER -----------------------------------------------

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register', { title: 'Register Page' });
});
router.post('/register', isGuest, async (req, res) => {
    console.log(req.body);
    const { username, password, repeatPassword, email, city } = req.body;
    const userIp = (req.ip || req.socket.remoteAddress).toString().replace('::ffff:', '');
    const role = userIp == ADMIN_IP_ADDRESS || "127.0.0.1" ? 'admin' : 'user';

    try {
        const user = await authService.register({ username, password, repeatPassword, email, city, role, userIp });
        const token = await authService.generateToken(user);

        res.cookie(SESSION_COOKIE_NAME, token, { httpOnly: true, secure: false, sameSite: 'lax' });
        res.redirect('/');

    } catch (err) {

        res.status(400).render('auth/register', { title: 'Register Page', username, email, city, role, userIp, error: getErr(err) });

    }
});


// --------------------------------- LOGOUT -----------------------------------------------

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(SESSION_COOKIE_NAME);
    res.redirect('/');
})

module.exports = router;