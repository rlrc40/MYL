const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const CommentSchema = new mongoose.Schema({
	from: ObjectId,
	text: String,
  likes: Number,
  answers: [ObjectId],
  created_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Comment', CommentSchema)
