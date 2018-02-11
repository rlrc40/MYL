const mongoose = require('mongoose')
const LANGUAGES = ["Spanish", "English", "Italian", "French", "Portuguese", "Deutsch", "Polish"]
const ObjectId = mongoose.Schema.Types.ObjectId

const GroupSchema = new mongoose.Schema({
  creator: ObjectId,
  name: {
    type: String,
    required: true,
    max: 100
  },
  description: {
    type: String,
    max: 160
  },
  avatar: {
    type: String,
    match: [/.*\.(jpg|jpeg|png)$/gim, 'Only valid .jpeg or .png files.']
  },
  languages: [{
    type: String,
    enum: LANGUAGES
  }],
  members: [ObjectId],
  created_at: {
    type: Date,
    default: Date.now
  },
})

module.exports = mongoose.model('Group', GroupSchema)
