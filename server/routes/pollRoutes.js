const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

router.post('/', pollController.createPoll);
router.get('/', pollController.getAllPolls);
router.get('/:id', pollController.getPollById);
router.post('/:id/vote', pollController.voteOnPoll);
router.delete('/:id', pollController.deletePoll);

module.exports = router;
