const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/event.controller");
const verifToken = require("../utils/verifToken");

router.post("/create", verifToken, createEvent);
router.get("/filter/user", verifToken, getAllEventsByUser);
router.get("/:id", verifToken, getEventById);
router.get("/", verifToken, getAllEvents);
router.post("/geolocation", verifToken, getAllEventsByGeoLocation);
router.put("/:id", verifToken, updateEvent);

router.put("/:id/participate", verifToken, participateInEvent);
router.put("/:id/request/participate", verifToken, participatePrivate);
router.put("/:id/accept/:userId", verifToken, acceptParticipateEvent);
router.put("/:id/refuse/:userId", verifToken, refuseParticipant);

router.delete("/:id/participate/cancel", verifToken, cancelParticipation);

module.exports = router;
