const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const CommentSchema = new mongoose.Schema({
  from: {
    type: ObjectId,
    required: 'from is required'
  },
  text: {
    type: String,
    max: 200
  },
  likes: {
    type: Number,
    min: 0
  },
  answers: [ObjectId],
  created_at: {
    type: Date,
    default: Date.now
  },
})

module.exports = mongoose.model('Comment', CommentSchema)
