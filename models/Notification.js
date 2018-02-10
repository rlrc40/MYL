const mongoose = require('mongoose')
const TYPES = ["message", "comment", "new-conexion", "like", "request-access-group", "accept-request-group", "dropout-group", "access-denied", "welcome"]


const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: TYPES,
    required: 'type is required'
  },
  url: {
    type: String,
    required: 'url is required'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Notification', NotificationSchema)
