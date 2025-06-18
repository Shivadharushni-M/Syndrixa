const express = require('express');
const router = express.Router();
const rsvpController = require('../controllers/rsvpController');

router.post('/', rsvpController.createRSVP);
router.get('/', rsvpController.getAllRSVPs);
router.get('/event/:eventId', rsvpController.getRSVPsByEvent);
router.delete('/:id', rsvpController.deleteRSVP);

module.exports = router;
