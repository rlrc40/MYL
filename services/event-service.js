const Event = require('../models/Event')

var service = {}
service.create = create
service.findEventsByEventName = findEventsByEventName
service.findEventsBySearch = findEventsBySearch
service.findEventsByFilter = findEventsByFilter
service.getAll = getAll
service.getEventById = getEventById
service.getEventsByUserId = getEventsByUserId
service.update = update
service.addFollower = addFollower
service.removeFollower = removeFollower
service._delete = _delete

module.exports = service

function create(req, res) {
  let eventParam = req.body
  let event = new Event()

  event.creator = eventParam.creator
  event.avatar = eventParam.avatar
  event.title = eventParam.title
  event.description = eventParam.description
  event.locate = eventParam.locate
  event.date = eventParam.date
  event.languages = eventParam.languages
  event.followers = eventParam.followers
  event.tags = eventParam.tags
  event.dateExpired = eventParam.dateExpired
  event.created_at = Date.now()

  event.save((err, eventSent) => {
    if (err) return res.status(500).send({
      message: 'Error when creating the event to the database'
    })
    res.status(200).send({
      message: 'Event has been created',
      event: eventSent
    })
  })
}

function findEventsByEventName(req, res) {
  let eventName = req.params.eventName
  Event.find({
    name: eventName
  }, (err, events) => {
    if (err) return res.status(500).send(err.name + ': ' + err.message)
    if (!events) return res.status(404).send({
      event: "Not found events"
    })
    res.status(200).send(events)
  })
}

function findEventsBySearch(req, res) {
  let keyword = req.params.keyword
  Event.find({
    $text: {
      $search: keyword
    }
  }, (err, events) => {
    if (err) return res.status(500).send(err.name + ': ' + err.message)
    if (!events) return res.status(404).send({
      event: "Not found events"
    })
    res.status(200).send(events)
  })
}

function findEventsByFilter(req, res) {
  let filter = req.params.filter
  Event.find(filter, (err, events) => {
    if (err) return res.status(500).send(err.name + ': ' + err.message)
    if (!events) return res.status(404).send({
      event: "Not found events"
    })
    res.status(200).send(events)
  })
}

function getAll(req, res) {
  Event.find({}, (err, events) => {
    if (err) return res.status(500).send(err.name + ': ' + err.message)
    if (!events) return res.status(404).send({
      event: "Not found events"
    })
    res.status(200).send(events)
  })
}

function getEventById(req, res) {
  let eventId = req.params.eventId
  Event.findById(
    eventId, (err, event) => {
      if (err) return res.status(500).send(err.name + ': ' + err.message)
      if (!event) return res.status(404).send({
        message: "Event not found"
      })
      res.status(200).send(event)
    })
}

function getEventsByUserId(req, res) {
  let userId = req.params.userId
  Event.find({
    followers: userId
  }, (err, events) => {
    if (err) return res.status(500).send(err.name + ': ' + err.message)
    if (!events) return res.status(404).send({
      event: "Not found events"
    })
    res.status(200).send(events)
  })
}

function update(req, res) {
  let eventId = req.params.eventId
  let update = req.body

  Event.findByIdAndUpdate(eventId, update, {
    new: true
  }, (err, eventUpdated) => {
    if (err) return res.status(500).send({
      message: 'Error at update event: ' + err.message
    })
    if (!eventUpdated) return res.status(404).send({
      message: 'Event not found'
    })
    res.status(200).send({
      message: 'Event has been updated',
      event: eventUpdated
    })
  })
}

function addFollower(req, res) {
  let eventId = req.params.eventId
  let newFollower = req.body

  Event.update({
    "_id": eventId
  }, {
    $push: {
      "followers": newFollower
    }
  }, (err, eventUpdated) => {
    if (err) return res.status(500).send({
      message: 'Error at add user: ' + err.message
    })
    if (!eventUpdated) return res.status(404).send({
      message: 'Event not found'
    })
    res.status(200).send({
      message: 'The User has been added',
      event: eventUpdated
    })
  })
}

function removeFollower(req, res) {
  let eventId = req.params.eventId
  let deleteFollower = req.body

  Event.update({
    "_id": eventId
  }, {
    $pop: {
      "followers": deleteFollower
    }
  }, (err, eventUpdated) => {
    if (err) return res.status(500).send({
      message: 'Error at remove user: ' + err.message
    })
    if (!eventUpdated) return res.status(404).send({
      message: 'Event not found'
    })
    res.status(200).send({
      message: 'The User has been removed',
      event: eventUpdated
    })
  })
}

function _delete(req, res) {
  let eventId = req.params.eventId

  Event.findById(eventId, (err, event) => {
    if (err) return res.status(500).send({
      message: 'Error at update event: ' + err.message
    })
    if (!event) return res.status(404).send({
      message: 'Event not found'
    })

    event.remove(err => {
      if (err) return res.status(500).send({
        message: "Error at deleting event: " + eventId
      })

      res.status(200).send({
        message: "Event has been deleted"
      })
    })
  })
}