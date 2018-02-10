const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const MessageSchema = new mongoose.Schema({
  from: {
    type: ObjectId,
    required: 'from is required'
  },
  to: {
    type: ObjectId,
    required: 'to is required'
  },
  text: {
    type: String,
    required: 'test of message is required'
  },
  answers: [ObjectId],
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Message', MessageSchema)
