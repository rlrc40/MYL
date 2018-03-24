const mongoose = require('mongoose')
const LANGUAGES = ["Spanish", "English", "Italian", "French", "Portuguese", "Deutsch", "Polish",""]
const TAGS = ["Meeting", "Party", "Speech", "Travel", "Culture", ""]
const ObjectId = mongoose.Schema.Types.ObjectId



const EventSchema = new mongoose.Schema({
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
    type: JSON,
    max: 100
  },
  date: Date,
  description: {
    type: String,
    min: 20,
    max: 260,
    required: 'description is too short'
  },
  languages: [{
    type: [String],
    enum: LANGUAGES
  }],
  followers: {
    type: [ObjectId]
  },
  tags: [{
    type: [String],
    enum: TAGS
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Events', EventSchema)
