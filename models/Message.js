const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const MessageSchema = new mongoose.Schema({
	from: ObjectId,
	to: ObjectId,
	text: {
		type: String,
		required: true
	},
	answers: [ObjectId],
  created_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Message', MessageSchema)
