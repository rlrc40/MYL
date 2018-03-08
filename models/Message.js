const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const MessageSchema = new mongoose.Schema({
	participants: {
		type: [ObjectId],
		required: 'participants are required'
	},
	messages: [{
		sender: ObjectId,
		text: {
	    required: 'text of message is required',
			type: String
		},
	}],
  created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Message', MessageSchema)
