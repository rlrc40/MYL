const mongoose = require('mongoose')
const LANGUAGES = ["Spanish", "English", "Italian", "French", "Portuguese", "Deutsch", "Polish"]
const ObjectId = mongoose.Schema.Types.ObjectId



const MeetingSchema = new mongoose.Schema({
  creator: {
    type: ObjectId,
    required: 'creator is required'
  },
  avatar: String,
  title: {
    type: String,
    required: 'creator is required',
    max: 100
  },
  locate: {
    type: String,
    max: 100
  },
  date: Date,
  description: {
    type: String,
    max: 160
  },
  languages: [{
    type: String,
    enum: LANGUAGES
  }],
  followers: {
    type: number,
    min: 0
  }
})

module.exports = mongoose.model('Meeting', MeetingSchema)
