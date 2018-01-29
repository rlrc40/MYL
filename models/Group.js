const mongoose = require('mongoose')
const LANGUAGES = ["Spanish", "English", "Italian", "French", "Portuguese", "Deutsch", "Polish"]
const ObjectId = mongoose.Schema.Types.ObjectId

const GroupSchema = new mongoose.Schema({
  creator: ObjectId,
	name: String,
	description: String,
	avatar: String,
	languages: [{ type: String, enum: LANGUAGES }],
	comments: [ObjectId],
	members: [ObjectId],
  created_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Group', GroupSchema)
