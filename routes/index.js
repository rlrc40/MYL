'use strict'

const express = require('express')
const api = express.Router()

// controllers
api.use('/users', require('../controllers/users-controller'))
api.use('/comments', require('../controllers/comments-controller'))
api.use('/groups', require('../controllers/groups-controller'))
api.use('/messages', require('../controllers/messages-controller'))
api.use('/notifications', require('../controllers/notifications-controller'))
api.use('/events', require('../controllers/events-controller'))

module.exports = api
