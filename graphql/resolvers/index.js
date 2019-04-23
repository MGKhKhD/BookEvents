const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Event = require("../../models/Event");
const User = require("../../models/User");
const Booking = require("../../models/Booking");
const { dateToISOString } = require("../../utils/helpers");

const reshapeEvent = event => {
  return {
    ...event._doc,
    _id: event._doc._id.toString(),
    date: dateToISOString(event._doc.date),
    creator: user.bind(this, event._doc.creator)
  };
};

const reshapeBooking = result => {
  return {
    ...result._doc,
    _id: result.id,
    user: user.bind(this, result._doc.user),
    event: bookedEvent.bind(this, result._doc.event),
    createdAt: dateToISOString(result._doc.createdAt),
    updatedAt: dateToISOString(result._doc.createdAt)
  };
};

const events = async eventIds => {
  try {
    const results = await Event.find({ _id: { $in: eventIds } });

    return results.map(result => {
      return reshapeEvent(result);
    });
  } catch (err) {
    throw err;
  }
};

const user = async creator => {
  try {
    const userId = creator._id;
    const result = await User.findById(userId);
    if (result) {
      return {
        ...result._doc,
        _id: result.id,
        createdEvents: events.bind(this, result._doc.createdEvents)
      };
    }
  } catch (err) {
    throw err;
  }
};

const bookedEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("event nout found");
    return reshapeEvent(event);
  } catch (err) {
    throw err;
  }
};

const root = {
  events: async () => {
    try {
      const results = await Event.find();
      return results.map(result => {
        return reshapeEvent(result);
      });
    } catch (err) {
      throw err;
    }
  },
  // bookings show all events, is must only fetch events of the user
  bookings: async (_, req) => {
    const isAuth = req.isAuthed;
    if (!isAuth) throw new Error("Unathenticated");
    try {
      const results = await Booking.find({ user: req.userId });
      return results.map(result => {
        return reshapeBooking(result);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async ({ inputEvent }, req) => {
    const isAuth = req.isAuthed;
    if (!isAuth) throw new Error("Unathenticated");
    const { title, description, price, date } = inputEvent;
    const event = new Event({
      title,
      description,
      price: +price,
      date: new Date(date),
      creator: req.userId
    });
    let newEvent;
    try {
      const result = await event.save();
      if (!result) throw new Error("something broken");
      newEvent = reshapeEvent(result);
      const foundUser = await User.findById(req.userId);
      if (!foundUser) throw new Error("user not found");
      foundUser.createdEvents.push(event);
      await foundUser.save();
      return newEvent;
    } catch (err) {
      throw err;
    }
  },
  createUser: async ({ inputUser }) => {
    try {
      const { email, password } = inputUser;
      const result = await User.findOne({ email });
      if (result) {
        throw new Error("user exists");
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword
      });
      const savedUser = await user.save();
      return { ...savedUser._doc, password: null, _id: savedUser.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) throw new Error("unsuccessful login!, trya again.");

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) throw new Error("unsuccessful login!, trya again.");
      const token = await jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_KEY,
        {
          expiresIn: "1h"
        }
      );
      return {
        userId: user.id,
        token: token,
        tokenExpiration: 1,
        email: user.email
      };
    } catch (err) {
      throw err;
    }
  },
  //update event
  // delete event
  bookEvent: async ({ eventId }, req) => {
    const isAuth = req.isAuthed;
    if (!isAuth) throw new Error("Unathenticated");

    //no duplcated booking

    try {
      const bookingEvent = await Event.findOne({ _id: eventId });
      if (!bookingEvent) throw new Error("event not found");
      const newBooking = new Booking({
        user: req.userId,
        event: eventId
      });
      const result = await newBooking.save();
      return reshapeBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async ({ bookingId }, req) => {
    // the use cancelling === user booked the event?

    const isAuth = req.isAuthed;
    if (!isAuth) throw new Error("Unathenticated");
    try {
      const bookedEvent = await Booking.findById(bookingId).populate("event");
      if (!bookedEvent) throw new Error("event is not found");

      const event = reshapeEvent(bookedEvent.event);

      await Booking.deleteOne({ _id: bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};

module.exports = root;
