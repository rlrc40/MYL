const express = require('express')
const router = express.Router()
const eventService = require('../services/event-service.js')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'event-pictures')
  },
  filename: function(req, file, cb){
    cb(null, new Date().toISOString().replace(/[^\w\s]/gi, '') + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {

  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    // reject a file
    cb(null, false)
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
})

module.exports = router

// routes
router.post('/create', upload.single('avatar'), create)
router.post('/find/title/', findEventsByEventNameTitle)
router.post('/search/', findEventsBySearch)
router.post('/find/', findEventsByFilter)
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

function findEventsByEventNameTitle(req, res) {
  eventService.findEventsByEventNameTitle(req, res)
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
