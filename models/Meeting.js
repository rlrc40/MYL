const mongoose = require('mongoose')
const LANGUAGES = ["Spanish", "English", "Italian", "French", "Portuguese", "Deutsch", "Polish"]
const ObjectId = mongoose.Schema.Types.ObjectId



const MeetingSchema = new mongoose.Schema({
  	creator: ObjectId,
  	avatar: String,
  	title: String,
  	locate: String,
  	date: Date,
  	description: String,
  	languages: [{ type: String, enum: LANGUAGES }],
  	followers: Number
})

module.exports = mongoose.model('Meeting', MeetingSchema)
