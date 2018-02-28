const mongoose = require('mongoose')
const LANGUAGES = ["Spanish", "English", "Italian", "French", "Portuguese", "Deutsch", "Polish"]
const TAGS = ["Meeting", "Party", "Speech", "Travel", "Culture"]
const ObjectId = mongoose.Schema.Types.ObjectId



const MeetingSchema = new mongoose.Schema({
  creator: {
    type: ObjectId,
    required: 'creator is required'
  },
  avatar: {
    type: String,
    match: [/^.*\.(jpg|jpeg|png|gif)$/i, 'Only valid .jpeg or .png files.']
  },
  title: {
    type: String,
    required: 'title is required',
    max: 100
  },
  locate: {
    type: Object,
    max: 100
  },
  date: Date,
  description: {
    type: String,
    required: 'description is required',
    min: 20,
    max: 160
  },
  languages: [{
    type: String,
    enum: LANGUAGES
  }],
  followers: {
    type: number,
    min: 0
  },
  tags: {
    type: string,
    enum: TAGS
  },
  date_expired: {
    type: date,
    required: 'Date expired is required'
  }
})

module.exports = mongoose.model('Events', MeetingSchema)
