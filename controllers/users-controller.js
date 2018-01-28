const express = require('express')
const router = express.Router()
const userService = require('../services/user-service.js')

module.exports = router

// routes
router.post('/register', register)
router.get('/', getAll)
router.get('/:userId', getById)
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

// PUT
function update(req, res) {
    userService.update(req, res)
}

// DELETE
function _delete(req, res) {
    userService._delete(req, res)
}
