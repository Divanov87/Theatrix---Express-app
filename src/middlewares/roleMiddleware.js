const eventsService = require('../services/eventsService');

// exports.isAdmin = async (req, res, next) => {
//     const event = await eventsService.getOne(req.params.eventId).lean();

//     if (event.owner != req.user?._id) {
//         return res.redirect(`/events/${req.params.eventId}/details`)
//     }
//     req.event = event;
//     next();
// }
exports.isUser = async (req, res, next) => {
    const event = await eventsService.getOne(req.params.eventId).lean();

    if (event.owner == req.user?._id) {
        return res.redirect(`/events/${req.params.eventId}/details`)
    }
    req.event = event;
    next();
}
exports.isAdmin = async (req, res, next) => {
  const event = await eventsService.getOne(req.params.eventId).lean();
    if (req.user && req.user.role === 'admin') {
      // User is an admin, grant access
      req.event = event;
      next();
    } else {
      // User is not an admin, deny access
      return res.redirect(`/`)
      //return res.redirect(`/events/${req.params.eventId}/details`)
    }
  };
exports.isUserLogged = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
      // User
      next();
    } else {
      // Not
      return res.redirect(`/`)
    }
  };

//   exports.isUser = (req, res, next) => {
//     if (req.user && req.user.role === 'user') {
//         return res.redirect(`/events/${req.params.eventId}/details`)
//       // User is an admin, grant access
    
//     } else {
//       // User is not an admin, deny access
//       next()
     
//     }
//   };