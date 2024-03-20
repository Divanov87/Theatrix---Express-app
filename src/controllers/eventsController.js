const router = require('express').Router();
const { isAuth } = require('../middlewares/authMiddleware');
const { isAdmin, isUser } = require('../middlewares/roleMiddleware');
const eventsService = require('../services/eventsService');
const { getErr } = require('../utilities/errHelper');


// ---------------------------------CREATE-------------------------------------------

router.get('/add', isAdmin, (req, res) => {
    res.render('events/add', { title: 'Add Event Page' })
});

router.post('/add', isAdmin, async (req, res) => {
    console.log(req.body);
    const eventsData = req.body

    try {
        await eventsService.create(req.user._id, eventsData);
        res.redirect('/events/');
    } catch (err) {
        res.status(400).render('events/add', { ...eventsData, title: 'Add Event Page', error: getErr(err) });
    }
});

// ---------------------------------EVENTS----------------------------------------

// router.get('/', async (req, res) => {
//     try {
//         const latestEvents = await eventsService.getLatest().lean()
//         res.render('events/', { title: 'Events Page', latestEvents })

//     } catch (err) {
//         res.status(400).render('events/', { title: 'Events Page', error: getErr(err) });
//     }
// });

// function delay(duration) {
//     return new Promise(resolve => setTimeout(resolve, duration));
// }

// router.get('/cityEvents', async (req, res) => {
//     try {
//         const city = req.query.city || 'Varna'; // Default city if not provided
//         const apiUrl = `http://127.0.0.1:3000/events/user?location=${city}`;

//         // Fetch cityEvents data from the API
//         const response = await fetch(apiUrl);
//         if (!response.ok) {
//             throw new Error('Failed to fetch cityEvents');
//         }
//         const cityEvents = await response.json();

//         // Adding a delay before rendering
//         await delay(2000); // 2000 milliseconds = 2 seconds

//         // Render Handlebars template with cityEvents data
//         res.render('events/index', { cityEvents });
//     } catch (error) {
//         console.error('Error rendering cityEvents:', error);
//         res.status(500).send('Error rendering cityEvents');
//     }
// });

// router.get('/', async (req, res) => {
//     const city = req.query.city || 'No Data'; // Default city if not provided
//     const apiUrl = `http://127.0.0.1:3000/events/user?location=${city}`;
//     const latestEvents = await eventsService.getLatest().lean()

//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(await delay(9000)) // 2000 milliseconds = 2 seconds
//         .then(cityEvents => {
//             res.render('events/', {cityEvents, latestEvents });
//         })
//         .catch(error => {
//             console.error('Error fetching events:', error);
//             res.status(500).send('Error fetching events');
//         });

// });



// router.get('/', async (req, res) => {
//     try {
//         // Get the user's location from the query parameters
//         const userLocation = req.query.location;


//         // if (!userLocation) {
//         //     return res.status(400).json({ error: "User location not provided" });
//         // }

//         // Filter events based on the user's location
//         const cityEvents = await eventsService.getEventsByLocation(userLocation);

//         // Respond with the filtered events
//         const latestEvents = await eventsService.getLatest().lean()
//                 res.render('events/index', { title: 'Events Page',  cityEvents, latestEvents  })
//         // res.json({ cityEvents });
//     } catch (error) {
//         // Handle errors
//         res.status(500).json({ error: error.message });
//     }
// });

// Endpoint for Geolocation
router.get('/user', async (req, res) => {
    try {

        const userLocation = req.query.location;
        if (!userLocation) {
            return res.status(400).json({ error: "User location not provided" });
        }
        const cityEvents = await eventsService.getEventsByLocation(userLocation);

        res.json({ cityEvents });
        console.log('Events sent successfully');
    } catch (error) {

        console.error('Error sending events:', error);
        res.status(500).json({ error: error.message });
    }
});




// router.get('/', async (req, res) => {
//     try {
//         // Get the city from the query parameters or default to 'Varna'
//         const city = req.query.location

//         // If there's no location parameter, redirect to the same route with a default location
//         if (!req.query.location) {
//             return res.redirect(`/events/?location=${encodeURIComponent(city)}`);
//         }

//         // Fetch JSON data from the API based on the city
//         const apiUrl = `http://127.0.0.1:3000/events/user?location=${city}`;
//         const response = await fetch(apiUrl);
//         const jsonData = await response.json();

//         // Render the data using the Handlebars template
//         res.render('events/user', { cityEvents: jsonData.cityEvents, city });
//     } catch (error) {
//         console.error('Error fetching or rendering data:', error);
//         res.status(500).send('Error fetching or rendering data');
//     }
// });




// router.get('/', (req, res) => {
//     try {
//         // Get the user's location from res.locals
//         const userLocation = res.locals.location;

//         if (userLocation !== undefined) {
//             res.render('events/index', { cityEvents });

//         }
//     } catch (error) {
//         console.error('Error redirecting:', error);
//         res.status(500).send('Error redirecting');
//     }
// });


router.get('/', async (req, res) => {
    try {
        // Get the city from cookies or default to 'Varna'
        const city = res.locals.location;
        console.log(city)
        if (city) {

            const cityEvents = await eventsService.getEventsByLocation(city);
            res.render('events/', { title: 'Events Page', cityEvents, city });

        } else {

            const latestEvents = await eventsService.getLatest().lean();
            res.render('events/', { title: 'Events Page', latestEvents });
        }
    } catch (error) {
        console.error('Error fetching or rendering data:', error);
        res.status(500).send('Error fetching or rendering data');
    }
});




// router.get('/', async (req, res) => {
//     try {
//         // Get the city from the query parameters or default to 'Varna'
//         const city = res.locals.location;

//         if (city) {
//             // Redirect to the appropriate page based on the user's location
//             //res.render('events/index', { title: 'Events Page',  cityEvents, latestEvents  })
//             const cityEvents = await eventsService.getEventsByLocation(city);
//             return res.redirect(`/events/?location=${encodeURIComponent(city)}`, { title: 'Events Page',  cityEvents });
//         } else {
//             const latestEvents = await eventsService.getLatest().lean()
//             res.render('events/', { title: 'Events Page', latestEvents  })
//         }
//     } catch (error) {
//         console.error('Error fetching or rendering data:', error);
//         res.status(500).send('Error fetching or rendering data');
//     }
// });


// ---------------------------------THEATER----------------------------------------

router.get('/theater', async (req, res) => {
    try {
        const theaterEvents = await eventsService.getEventsByCategory('Theater');
        res.render('events/theater', { title: 'Theather Events Page', theaterEvents })
    } catch (err) {
        res.status(400).render('events/theater', { title: 'Concerts Events Page', error: getErr(err) });
    }
});
// ---------------------------------CONCERTS----------------------------------------

router.get('/concerts', async (req, res) => {
    try {
        const concertEvents = await eventsService.getEventsByCategory('Concert');
        res.render('events/concerts', { title: 'Concerts Events Page', concertEvents })
    } catch (err) {
        res.status(400).render('events/concerts', { title: 'Concerts Events Page', error: getErr(err) });
    }
});

// ---------------------------------GEO-------------------------------------------

// router.get('/:city', async (req, res) => {
//     try {
//         const city = req.params.city;
//         const cityEvents = await eventsService.getEventsByCategory(city);
//         res.json({ cityEvents });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// ---------------------------------UPDATE/EDIT-------------------------------------------

router.get('/:eventId/edit', isAdmin, async (req, res) => {
    try {
        const eventsData = req.event;
        res.render('events/edit', { title: 'Edit page', ...eventsData })
    } catch (err) {
        res.status(400).render('events/edit', { ...eventsData, title: 'Edit page', error: getErr(err) });
    }
});

router.post('/:eventId/edit', isAdmin, async (req, res) => {
    console.log(req.body);
    try {
        const eventsData = req.body;
        await eventsService.update(req.params.eventId, eventsData);
        res.redirect(`/events/${req.params.eventId}/details`)
    } catch (err) {
        const eventsData = req.body;
        res.status(400).render('events/edit', { ...eventsData, title: 'Edit page', error: getErr(err) })
    }
});

// ---------------------------------DELETE-------------------------------------------

router.get('/:eventId/delete', isAdmin, async (req, res) => {
    try {
        await eventsService.delete(req.params.eventId);
        res.redirect('/events');
    } catch (err) {
        res.status(400).render('/:eventId/delete', { error: getErr(err) });
    }
});


// ---------------------------------DETAILS-------------------------------------------

router.get('/:eventId/details', async (req, res) => {

    
    try {

        const latestEvents = await eventsService.getLatest().lean();
   
        const eventsData = await eventsService.getOneOwner(req.params.eventId).lean();

        const ticketsData = await eventsService.getOne(req.params.eventId).lean()
        const ticketsLeft = ticketsData.tickets - 1;


        //const likedUsers = eventsData.liked.map(user => user.username).join(', ');
        const isOwner = eventsData.owner && eventsData.owner._id == req.user?._id;
        const isLiked = eventsData.likesList.some(user => user._id == req.user?._id);

        const eventsData2 = await eventsService.getOneBuyer(req.params.eventId).lean();
        const isBuyed = eventsData2.buysList.some(user => user._id == req.user?._id);

        const eventsData3 = await eventsService.getOnePin(req.params.eventId).lean();
        const isPinned = eventsData3.pinsList.some(user => user._id == req.user?._id);

        res.render('events/details', { ...eventsData, isOwner, isLiked, isBuyed, isPinned, ticketsLeft, latestEvents,  title: 'Details page' });
    } catch (err) {
        // res.status(400).render(`events/${req.params.eventId}/details`, { error: getErr(err) });
        res.status(400).render('404', { error: getErr(err) });
    }
});

// ---------------------------------LIKE--------------------------------------------------

router.get('/:eventId/like', isUser, async (req, res) => {

    try {
        const eventsData = await eventsService.getOneOwner(req.params.eventId).lean();
        const isLiked = eventsData.likesList.some(user => user._id == req.user?._id);
        if (!isLiked) {
            try {

                await eventsService.like(req.params.eventId, req.user._id)
                res.redirect(`/events/${req.params.eventId}/details`);
            } catch (err) {
                res.status(400).render('/:eventId/like', { error: getErr(err) });
            }
        } else {
            res.redirect(`/events/${req.params.eventId}/details`);
        }
    } catch (err) {
        res.status(400).render('events/:eventId', { error: getErr(err) });
    }

});

// ---------------------------------PIN--------------------------------------------------

router.get('/:eventId/pin', isAdmin, async (req, res) => {

    try {
        const eventsData = await eventsService.getOnePin(req.params.eventId).lean();
        const isPinned = eventsData.pinsList.some(user => user._id == req.user?._id);
        if (!isPinned) {
            try {

                await eventsService.pin(req.params.eventId, req.user._id)
                res.redirect(`/events/${req.params.eventId}/details`);
            } catch (err) {
                res.status(400).render('/:eventId/pin', { error: getErr(err) });
            }
        } else {
            res.redirect(`/events/${req.params.eventId}/details`);
        }
    } catch (err) {
        res.status(400).render('events/:eventId', { error: getErr(err) });
    }

});


// ---------------------------------BUY--------------------------------------------------

// router.get('/:eventId/buy', isUser, async (req, res) => {

//     try {
//         const eventsData = await eventsService.getOneBuyer(req.params.eventId).lean();
//         const isLiked = eventsData.buysList.some(user => user._id == req.user?._id);
//         if (!isLiked){
//             try {

//                 await eventsService.buy(req.params.eventId, req.user._id)
//                 res.redirect(`/events/${req.params.eventId}/details`);
//             } catch (err) {
//                 res.status(400).render('/:eventId/buy', { error: getErr(err) });
//             }
//         } else {
//             res.redirect(`/events/${req.params.eventId}/details`);
//         }
//     } catch (err) {
//         res.status(400).render('events/:eventId', { error: getErr(err) });
//     }

// });

router.get('/:eventId/buy', isUser, async (req, res) => {
    try {
        const eventId = req.params.eventId; // Extract the eventId from request parameters
        const userId = req.user._id; // Extract the userId from the authenticated user

        // Call the buy function from the service layer
        await eventsService.buy(eventId, userId);

        // Redirect to the event details page after successful purchase
        res.redirect(`/events/${eventId}/details`);
    } catch (err) {
        // Handle errors appropriately
        res.status(400).render('error', { error: err.message });
    }
});


module.exports = router;