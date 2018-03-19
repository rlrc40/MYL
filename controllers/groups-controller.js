const express = require('express')
const router = express.Router()
const groupService = require('../services/group-service.js')

module.exports = router

// routes
router.post('/register', register)
router.post('/filter', findGroupsByFilter)
router.post('/find/name', findGroupsByName)
router.post('/find', findGroupsBySearch)
router.get('/', getAllGroups)
router.get('/user/:userId', findGroupsByUserId)
router.get('/:groupId', findGroupById)
router.put('/:groupId', update)
router.put('/add/:userId', addMember)
router.put('/remove/:userId', removeMember)
router.delete('/:groupId', _delete)


// POST
function register(req, res) {
    groupService.create(req, res)
}

// GET
function getAllGroups(req, res) {
    groupService.getAllGroups(req, res)
}

function findGroupsByUserId(req, res) {
    groupService.findGroupsByUserId(req, res)
}

function findGroupsByName(req, res) {
    groupService.findGroupsByName(req, res)
}

function findGroupsByFilter(req, res) {
    groupService.findGroupsByFilter(req, res)
}

function findGroupsBySearch(req, res) {
    groupService.findGroupsBySearch(req, res)
}

function findGroupById(req, res) {
    groupService.findGroupById(req, res)
}

// PUT
function addMember(req, res) {
    groupService.addMember(req, res)
}

function update(req, res) {
    groupService.update(req, res)
}

// DELETE
function _delete(req, res) {
    groupService._delete(req, res)
}

function removeMember(req, res) {
    groupService.removeMember(req, res)
}
