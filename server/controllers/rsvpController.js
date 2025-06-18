const RSVP = require('../models/RSVP');


exports.createRSVP = async (req, res) => {
  try {
    const rsvp = await RSVP.create(req.body);
    res.status(201).json(rsvp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAllRSVPs = async (req, res) => {
  try {
    const rsvps = await RSVP.find()
      .populate('eventId')
      .populate('studentId');
    res.status(200).json(rsvps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getRSVPsByEvent = async (req, res) => {
  try {
    const rsvps = await RSVP.find({ eventId: req.params.eventId }).populate('studentId');
    res.status(200).json(rsvps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteRSVP = async (req, res) => {
  try {
    const deleted = await RSVP.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'RSVP not found' });
    res.status(200).json({ message: 'RSVP deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
