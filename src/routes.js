const router = require('express').Router();

const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const eventsController = require('./controllers/eventsController');

router.use('/', homeController);
router.use('/auth', authController);
router.use('/events', eventsController);

router.use('*', (req, res) => {
    res.status(404).render('404', { title: 'Not found'});
});

module.exports = router;