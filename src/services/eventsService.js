const Events = require('../models/Events');
const User = require('../models/User');

exports.create = async (userId, eventsData) => {

  const createdEvents = await Events.create({owner: userId, ...eventsData});
  await User.findByIdAndUpdate(userId, {$push: {created: createdEvents._id}});
  return createdEvents;

}

exports.getAll = () => Events.find();
exports.find = (userId) => User.findById(userId);
exports.getOne = (eventId) => Events.findById(eventId);
exports.getLatest = () => Events.find().sort({createdAt: -1}).limit(10);
// exports.getLatest = () => Events.find().sort({createdAt: -1}).limit(3);
exports.getOneOwner = (eventId) => this.getOne(eventId).populate('owner').populate('likesList');
exports.getOneBuyer = (eventId) => this.getOne(eventId).populate('owner').populate('buysList');
exports.getOnePin = (eventId) => this.getOne(eventId).populate('owner').populate('pinsList');


exports.getPinned = async () => {
  const pins = await Events.find({ pinsList: { $exists: true, $ne: [] } }).sort({createdAt: -1}).limit(4).lean();
  return pins;
};

exports.getEventsByCategory = async (category) => {
    return Events.find({ category }).sort({createdAt: -1}).limit(10).lean();
};

exports.getEventsSortedByRating = async () => {
  return Events.find().sort({ rating: -1 }).limit(10).lean();
};

exports.getEventsByLocation = async (city) => {
    return Events.find({ location: city }).sort({ createdAt: -1 }).limit(10).lean();
};


exports.getEventsByCategoryLogged = async (category, location) => {
    return Events.find({ category, location }).sort({createdAt: -1}).limit(10).lean();
};

exports.getEventsSortedByRatingLogged = async (city) => {
  return Events.find({ location: city }).sort({ rating: -1 }).limit(10).lean();
};


exports.like = async (eventId, userId) => {
  await Events.findByIdAndUpdate(eventId, {$push: {likesList: userId}});
  await User.findByIdAndUpdate(userId, {$push: {liked: eventId}});
}
exports.pin = async (eventId, userId) => {
  await Events.findByIdAndUpdate(eventId, {$push: {pinsList: userId}});
  await User.findByIdAndUpdate(userId, {$push: {pinned: eventId}});
}
// exports.buy = async (eventId, userId) => {
//   await Events.findByIdAndUpdate(eventId, {$push: {buysList: userId}});
//   await User.findByIdAndUpdate(userId, {$push: {bought: eventId}});
// }

exports.buy = async (eventId, userId) => {
  try {
      // Find the event by its ID
      const eventData = await Events.findById(eventId);

      // Check if the event exists
      if (!eventData) {
          throw new Error('Event not found');
      }

      // Check if there are available tickets
      if (eventData.tickets === 0) {
          throw new Error('No tickets available');
      }

      // Check if there's only one ticket left
      if (eventData.tickets === 1) {
          // If there's only one ticket left, lock the event to prevent concurrent purchases
          const lockedEvent = await Events.findOneAndUpdate(
              { _id: eventId, tickets: 1 },
              { $set: { locked: true } },
              { new: true }
          );

          if (!lockedEvent) {
              throw new Error('Another user has just bought the last ticket');
          }
      }

      // Decrement tickets count by 1
      eventData.tickets--;

      // Add the user to buysList
      eventData.buysList.push(userId);

      // Save the updated event data
      await eventData.save();

      // Add the event to the user's bought events list
      await User.findByIdAndUpdate(userId, { $push: { bought: eventId } });

  } catch (err) {
      // Propagate the error for handling in the controller
      throw err;
  }
}




// exports.AddPublication = async (userId, publicationId) => User.findByIdAndUpdate({ _id: userId }, { myPublications: publicationId });




exports.update = (eventId, eventsData) => Events.findByIdAndUpdate(eventId, eventsData, {runValidators: true});

exports.delete = (eventId) => Events.findByIdAndDelete(eventId);



exports.search = async (search) => {
  
  try {
    let query = Events.find();

    if (search.author) {
      const author = await User.findOne({ username: new RegExp(search.author, 'i'),}).select('_id');

      if (author) {
        query = query.where('author').equals(author._id);
      }
    }
    if (search.name) {
      query = query.where('name', new RegExp(search.name, 'i'));
    }
    if (search.category) {
      query = query.where('category', new RegExp(search.category, 'i'));
    }
    if (search.location) {
      query = query.where('location', new RegExp(search.location, 'i'));
    }
    if (search.date) {
      query = query.where('date', new RegExp(search.date, 'i'));
    }
    if (search.rating) {
      query = query.where('rating', new RegExp(search.rating, 'i'));
    }
    // if (search.year) {
    //   query = query.where('year').equals(year);
    // }
    

    return query.lean();
  } catch (err) {
    return err;
  }
}