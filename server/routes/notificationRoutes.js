const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/', notificationController.createNotification);
router.get('/', notificationController.getAllNotifications);
router.get('/user/:userId', notificationController.getNotificationsByUser);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;