const express = require('express')
const router = express.Router()
const groupService = require('../services/group-service.js')

module.exports = router

// routes
router.post('/register', register)
router.get('/', getAllGroups)
router.get('/user/:userId', getGroupsByUserId)
router.get('/members/:groupId', getGroupMembers)
router.get('/:groupId', getGroupById)
router.put('/:groupId', update)
router.delete('/:groupId', _delete)


// POST
function register(req, res) {
    groupService.create(req, res)
}

// GET
function getAllGroups(req, res) {
    groupService.getAllGroups(req, res)
}

function getGroupsByUserId(req, res) {
    groupService.getGroupsByUserId(req, res)
}

function getGroupById(req, res) {
    groupService.getGroupById(req, res)
}

function getGroupMembers(req, res) {
    groupService.getGroupMembers(req, res)
}

// PUT
function update(req, res) {
    groupService.update(req, res)
}

// DELETE
function _delete(req, res) {
    groupService._delete(req, res)
}
