const express = require('express')
const router = express.Router()
const messageService = require('../services/message-service.js')

module.exports = router

// routes
router.post('/send', send)
router.get('/:messageId', getMessageById)
router.get('/user/:userId', getMessagesByUserId)
router.put('/:messageId', update)
router.put('/answer/:messageId', answer)
router.delete('/:messageId', _delete)



// POST
function send(req, res) {
    messageService.create(req, res)
}

// GET
function getMessageById(req, res) {
    messageService.getMessageById(req, res)
}

function getMessagesByUserId(req, res) {
    messageService.getMessagesByUserId(req, res)
}

// PUT
function update(req, res) {
    messageService.update(req, res)
}

function answer(req, res) {
    messageService.answer(req, res)
}

// DELETE
function _delete(req, res) {
    messageService._delete(req, res)
}
