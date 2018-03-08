const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const TYPES = ["message", "comment", "new-conexion", "like", "request-access-group", "accept-request-group", "dropout-group", "access-denied", "welcome"]


const NotificationSchema = new mongoose.Schema({
  user: ObjectId,
  type: {
    type: String,
    enum: TYPES,
    required: 'type is required'
  },
  url: {
    type: String,
    required: 'url is required'
  },
  text: {
    type: String,
    required: 'text is required',
    max: 100
  },
  visited: Boolean,
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Notification', NotificationSchema)
