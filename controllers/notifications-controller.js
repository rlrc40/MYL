const express = require('express')
const router = express.Router()
const notificationService = require('../services/notification-service.js')

module.exports = router

// routes
router.post('/send', send)
router.get('/user/:userId', getNotificationsByUserId)
router.put('/:notificationId', update)
router.delete('/:notificationId', _delete)



// POST
function send(req, res) {
    notificationService.create(req, res)
}

// GET
function getNotificationsByUserId(req, res) {
    notificationService.getNotificationsByUserId(req, res)
}

// PUT
function update(req, res) {
    notificationService.update(req, res)
}

// DELETE
function _delete(req, res) {
    notificationService._delete(req, res)
}
