const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const eventsService = require('../services/eventsService');


router.get('/', async (req, res) => {

    const city = res.locals.location;

    if (city) {

        const latestPins = await eventsService.getPinned();

        const topRatedEventsLogged = await eventsService.getEventsSortedByRatingLogged(city);

        const theaterEventsLogged = await eventsService.getEventsByCategoryLogged('Theater', city);

        const concertEventsLogged = await eventsService.getEventsByCategoryLogged('Concert', city);

        res.render('home', { title: 'Theatrix - Discover Events, Buy Tickets, & Have Fun!', latestPins, city, topRatedEventsLogged, theaterEventsLogged, concertEventsLogged })

    } else {

        const latestPins = await eventsService.getPinned();

        const topRatedEvents = await eventsService.getEventsSortedByRating();

        const theaterEvents = await eventsService.getEventsByCategory('Theater');

        const concertEvents = await eventsService.getEventsByCategory('Concert');

        res.render('home', { title: 'Theatrix - Discover Events, Buy Tickets, & Have Fun!', latestPins, topRatedEvents, theaterEvents, concertEvents })

    }


});


router.get('/search', async (req, res) => {
    const search = req.query;
    const events = await eventsService.search(search)//.lean();
    console.log(req.query)
    res.render('home/search', { title: 'Search Page', events, search });
});

// router.get('/profile', isAuth, async (req, res) => {
//     res.render('home/profile', {})
// });

router.get('/contacts', async (req, res) => {
    res.render('home/contacts', { title: 'Contacts Page' })
});


router.get('/about', async (req, res) => {
    res.render('home/about', { title: 'About Page' })
});


router.get('/profile', isAuth, async (req, res) => {
    const user = await eventsService.find(req.user._id).populate('bought').populate('liked').lean(); //.populate('shares')
    const likes = user.liked.map(x => x.name).join(', ');
    // const publicationTitles = user.myPublications.map(x => x.title).join(', ');
    // const sharedTitles = user.shares.map(x => x.title).join(', ');
    const boughts = user.bought.map(x => x.name).join(', ');
    res.render('home/profile', { title: "Profile page", ...user, likes, boughts })
});

module.exports = router;