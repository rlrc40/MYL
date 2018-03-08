const express = require('express')
const router = express.Router()
const eventService = require('../services/event-service.js')

module.exports = router

// routes
router.post('/create', create)
router.post('/find/name/', findEventsByEventName)
router.post('/find/', findEventsBySearch)
router.post('/filter/', findEventsByFilter)
router.get('/', getAll)
router.get('/:eventId', getEventById)
router.get('/user/:userId', getEventsByUserId)
router.put('/:eventId', update)
router.put('/add-follower/:eventId', addFollower)
router.put('/remove-follower/:eventId', removeFollower)
router.delete('/:eventId', _delete)

// POST
function create(req, res) {
  eventService.create(req, res)
}

function findEventsByEventName(req, res) {
  eventService.findEventsByEventName(req, res)
}

function findEventsBySearch(req, res) {
  eventService.findEventsBySearch(req, res)
}

function findEventsByFilter(req, res) {
  eventService.findEventsByFilter(req, res)
}

// GET
function getAll(req, res) {
  eventService.getAll(req, res)
}

function getEventById(req, res) {
  eventService.getEventById(req, res)
}

function getEventsByUserId(req, res) {
  eventService.getEventsByUserId(req, res)
}

// PUT
function update(req, res) {
  eventService.update(req, res)
}

function addFollower(req, res) {
  eventService.addFollower(req, res)
}

function removeFollower(req, res) {
  eventService.removeFollower(req, res)
}

// DELETE
function _delete(req, res) {
  eventService._delete(req, res)
}
