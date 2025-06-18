const Poll = require('../models/Poll');


exports.createPoll = async (req, res) => {
  try {
    const poll = await Poll.create(req.body);
    res.status(201).json(poll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().populate('eventId');
    res.status(200).json(polls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate('eventId');
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.status(200).json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.voteOnPoll = async (req, res) => {
  const { userId, selectedOption } = req.body;
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    poll.votes.push({ userId, selectedOption });
    await poll.save();
    res.status(200).json(poll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deletePoll = async (req, res) => {
  try {
    const deleted = await Poll.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Poll not found' });
    res.status(200).json({ message: 'Poll deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
