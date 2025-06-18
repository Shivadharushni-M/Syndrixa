const Club = require('../models/Club');

// Create a new club
exports.createClub = async (req, res) => {
  try {
    const club = new Club(req.body);
    await club.save();
    res.status(201).json(club);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all clubs
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate('presidents').populate('members');
    res.status(200).json(clubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a club by ID
exports.getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('events');
    if (!club) return res.status(404).json({ error: 'Club not found' });
    res.status(200).json(club);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a club by ID
exports.updateClub = async (req, res) => {
  try {
    const updated = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Club not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a club by ID
exports.deleteClub = async (req, res) => {
  try {
    const deleted = await Club.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Club not found' });
    res.status(200).json({ message: 'Club deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
