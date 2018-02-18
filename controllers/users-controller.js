const express = require('express')
const router = express.Router()
const userService = require('../services/user-service.js')

module.exports = router

// routes
router.post('/register', register)
router.get('/', getAll)
router.get('/:userId', getById)
router.get('/group/:groupId', getUsersByGroupId)
router.get('/connections/:userId', getUserConnections)
router.post('/search', getUsersBySearch)
router.put('/:userId', update)
router.delete('/:userId', _delete)



// POST
function register(req, res) {
    userService.create(req, res)
}

// GET
function getAll(req, res) {
    userService.getAll(req, res)
}

function getById(req, res) {
    userService.getById(req, res)
}

function getUsersByGroupId(req, res) {
    userService.getUsersByGroupId(req, res)
}

function getUserConnections(req, res) {
    userService.getUserConnections(req, res)
}

function getUsersBySearch(req, res) {
    userService.getUsersBySearch(req, res)
}

// PUT
function update(req, res) {
    userService.update(req, res)
}

// DELETE
function _delete(req, res) {
    userService._delete(req, res)
}
