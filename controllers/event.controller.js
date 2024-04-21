const Event = require("../models/event.model");

const eventValidationSchema = require("../dto/event.validations");
const { sendNotification } = require("../utils/notification");
const UserModel = require("../models/user.model");
const { createNotification } = require("./notification.controller");
const {
  createNewConversation,
  joinConversationByEvent
} = require("./conversation.controller");
const { formatType } = require("../utils/formatType");
const fieldModel = require("../models/field.model");
// Create Event
const createEvent = async (req, res) => {
  try {
    const { error, value } = eventValidationSchema.validate(req.body);

    if (error) {
      console.log("error", error.details);
      return res.status(400).json({ success: false, error: error.details });
    }
    const {
      title,
      eventType,
      field,
      eventDate,
      startTime,
      endTime,
      creator,
      eventInfo,
      gender,
      description
    } = value;
    const event = new Event({
      title,
      eventType,
      field,
      eventDate,
      startTime,
      gender,
      endTime,
      creator,
      eventInfo,
      description
    });
    if (!event.participants.includes(creator)) {
      event.participants.push(creator);
    }

    // Save the event
    const savedEv = await event.save();
    await createNewConversation(savedEv._id);
    await joinConversationByEvent(creator, savedEv._id);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.log("Creating Event", error);
    res.status(500).json({ success: false, error: "Error creating event" });
  }
};



// Get All Events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("field")
      .populate("creator")
      .populate("participants")
      .populate("requests");

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching events" });
  }
};
const getAllEventsByUser = async (req, res) => {
  try {
    const { gender, eventType, level, state, startDate } = req.query;
   
    const user = req.xuser;
    const userLatitude = user.userLocation.lat;
    const userLongitude = user.userLocation.long;
    console.log("New Date", startDate);

    // Specify your desired range in kilometers
    const rangeInKilometers = 100000; // Adjust as needed

    const pipeline = [
      {
        $lookup: {
          from: "fields", // Replace with the actual name of the "fields" collection
          localField: "field",
          foreignField: "_id",
          as: "field"
        }
      },
      {
        $unwind: "$field" // Unwind the "field" array created by $lookup
      },

      {
        $project: {
          // Calculate the distance using your custom function
          distance: {
            $function: {
              body: `function(lat1, lon1, lat2, lon2) {
                var R = 6371; // Radius of the earth in km
                var dLat = (lat2 - lat1) * Math.PI / 180;
                var dLon = (lon2 - lon1) * Math.PI / 180;
                var a =
                  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var distance = R * c; // Distance in km
                return distance;
              }`,
              args: [
                "$field.mapLocation.latitude",
                "$field.mapLocation.longitude",
                userLatitude,
                userLongitude
              ],
              lang: "js"
            }
          },
          eventInfo: 1,
          creator: 1,
          eventType: 1,
          field: 1,
          eventDate: 1,
          startTime: 1,
          endTime: 1,
          description: 1,
          gender: 1,
          participants: 1
        }
      },
      {
        $match: {
          distance: { $lte: rangeInKilometers } // Filter events within the specified range
        }
      },
      {
        $lookup: {
          from: "users", // Replace with the actual name of the "users" collection
          localField: "creator",
          foreignField: "_id",
          as: "creator"
        }
      },
      {
        $unwind: "$creator" // Unwind the "field" array created by $lookup
      },
      {
        $match: {
          gender: gender ? gender : { $exists: true },
          eventType: eventType ? eventType : { $exists: true },
          "eventInfo.level": level ? level : { $exists: true },
          "field.address": state ? state : { $exists: true },

          eventDate: startDate
            ? {
                $gte: new Date(startDate),
                $lt: new Date(
                  new Date(startDate).setDate(new Date(startDate).getDate() + 1)
                )
              }
            : { $exists: true }
        }
      }
    ];

    // Execute the aggregation pipeline
    const events = await Event.aggregate(pipeline);

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Error fetching events" });
  }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getAllEventsByGeoLocation = async (req, res) => {
  try {
    const { gender, eventType, level, state, startDate } = req.query;
    const { coordinations } = req.body;

    const { latitute, longitude } = coordinations;

    // Specify your desired range in kilometers
    const rangeInKilometers = 100000; // Adjust as needed

    const pipeline = [
      {
        $lookup: {
          from: "fields", // Replace with the actual name of the "fields" collection
          localField: "field",
          foreignField: "_id",
          as: "field"
        }
      },
      {
        $unwind: "$field" // Unwind the "field" array created by $lookup
      },

      {
        $project: {
          // Calculate the distance using your custom function
          distance: {
            $function: {
              body: `function(lat1, lon1, lat2, lon2) {
                var R = 6371; // Radius of the earth in km
                var dLat = (lat2 - lat1) * Math.PI / 180;
                var dLon = (lon2 - lon1) * Math.PI / 180;
                var a =
                  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var distance = R * c; // Distance in km
                return distance;
              }`,
              args: [
                "$field.mapLocation.latitude",
                "$field.mapLocation.longitude",
                latitute,
                longitude
              ],
              lang: "js"
            }
          },
          eventInfo: 1,
          creator: 1,
          eventType: 1,
          field: 1,
          eventDate: 1,
          startTime: 1,
          endTime: 1,
          description: 1,
          gender: 1,
          participants: 1
        }
      },
      {
        $match: {
          distance: { $lte: rangeInKilometers } // Filter events within the specified range
        }
      },
      {
        $lookup: {
          from: "users", // Replace with the actual name of the "users" collection
          localField: "creator",
          foreignField: "_id",
          as: "creator"
        }
      },
      {
        $unwind: "$creator" // Unwind the "field" array created by $lookup
      },
      {
        $match: {
          gender: gender ? gender : { $exists: true },
          eventType: eventType ? eventType : { $exists: true },
          "eventInfo.level": level ? level : { $exists: true },
          "field.address": state ? state : { $exists: true },
          eventDate: startDate
            ? { $gte: new Date(startDate) }
            : { $exists: true }
        }
      }
    ];


    // Execute the aggregation pipeline
    const events = await Event.aggregate(pipeline);

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Error fetching events" });
  }
};

/**
 * Update Event
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventData = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, {
      new: true
    });

    if (!updatedEvent) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error updating event" });
  }
};



/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const participatePrivate = async (req, res) => {
  try {
    const eventId = req.params.id;
    const user = req.xuser;

    const event = await Event.findById(eventId);
    console.log("Event", event);

    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    if (event.participants.includes(user._id)) {
      return res.status(400).json({
        success: false,
        error: "User already participated in this event"
      });
    }
    if (event.requests.includes(user._id)) {
      return res.status(400).json({
        success: false,
        error: "Request is already sent"
      });
    }
    event.requests = [...event.requests, user._id];
    const savedEv = await event.save();
    const creator = await UserModel.findById(savedEv.creator);
    const field = await fieldModel.findById(savedEv.field);
    console.log("Creator", creator);

    const notifResult = await sendNotification(
      creator.deviceId,
      "Demande de participation",
      `${user.firstName} ${user.lastName} à rejoint ${formatType(
        savedEv.eventInfo.eventType
      )} à ${field.fieldName}`
    );
    const notif = await createNotification(
      "Demande de participation",
      `${user.firstName} ${user.lastName} à rejoint ${formatType(
        savedEv.eventInfo.eventType
      )} à ${field.fieldName}`,
      "PARTICIPATION_REQUEST",
      creator._id,
      savedEv._id,
      null
    );
    // console.log("Notif Result", notifResult);
    //await joinConversationByEvent(user._id, savedEv._id);
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.log("ERrror", error);
    res
      .status(500)
      .json({ success: false, error: "Error participating in event" });
  }
};




/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId)
      .populate("field")
      .populate("creator")
      .populate("participants")
      .populate("requests");
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.log("ERrror", error);
    res.status(500).json({ success: false, error: "Error fetching event" });
  }
};



/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const acceptParticipateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.params.userId;
    const user = req.xuser;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    if (event.participants.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: "User already participated in this event"
      });
    }

    if (!event.requests.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: "User not in the list of requests for this event"
      });
    }

    event.requests = event.requests.filter((requestId) => requestId != userId);
    event.participants.push(userId);
    await event.save();

    await joinConversationByEvent(userId, event._id);

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.log("Error", error);
    res
      .status(500)
      .json({ success: false, error: "Error accepting participation request" });
  }
};



/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const refuseParticipant = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.params.userId;
    const user = req.xuser;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    if (!event.requests.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: "User not in the list of requests for this event"
      });
    }

    event.requests = event.requests.filter((requestId) => requestId !== userId);
    await event.save();

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.log("Error", error);
    res
      .status(500)
      .json({ success: false, error: "Error refusing participation request" });
  }
};


/**
 * Participate in Event
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const participateInEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const user = req.xuser;

    const event = await Event.findById(eventId);
    console.log("Event", event);

    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    if (event.participants.includes(user._id)) {
      return res.status(400).json({
        success: false,
        error: "User already participated in this event"
      });
    }

    event.participants = [...event.participants, user._id];
    const savedEv = await event.save();
    const creator = await UserModel.findById(savedEv.creator);
    const field = await fieldModel.findById(savedEv.field);
    console.log("Creator", creator);

    const notifResult = await sendNotification(
      creator.deviceId,
      "Demande de participation",
      `${user.firstName} ${user.lastName} à rejoint ${formatType(
        savedEv.eventInfo.eventType
      )} à ${field.fieldName}`
    );
    const notif = await createNotification(
      "Demande de participation",
      `${user.firstName} ${user.lastName} à rejoint ${formatType(
        savedEv.eventInfo.eventType
      )} à ${field.fieldName}`,
      "PARTICIPATION_REQUEST",
      creator._id,
      savedEv._id,
      null
    );
    console.log("Notif Result", notifResult);
    joinConversationByEvent(user._id, savedEv._id);
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.log("ERrror", error);
    res
      .status(500)
      .json({ success: false, error: "Error participating in event" });
  }
};




/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const cancelParticipation = async (req, res) => {
  try {
    const eventId = req.params.id;
    const user = req.xuser;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }
    if (!event.participants.includes(user._id)) {
      return res.status(400).json({
        success: false,
        error: "User is not a participant in this event"
      });
    }

    event.participants = event.participants.filter(
      (participantId) => participantId !== user._id
    );
    await event.save();

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error canceling participation in event"
    });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  updateEvent,
  participateInEvent,
  cancelParticipation,
  participatePrivate,
  acceptParticipateEvent,
  refuseParticipant,
  getEventById,
  getAllEventsByUser,
  getAllEventsByGeoLocation
};
