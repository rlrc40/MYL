const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const GENDERS = ["M", "F"]
const LANGUAGES = ["Spanish", "English", "Italian", "French", "Portuguese", "Deutsch", "Polish"]

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    max: 60,
    require: 'The name is required.'
  },
  email: {
    type: String,
    match: [/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|} ~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i, 'Format email is not valid'],
    require: 'The email is required.'
  },
  description: {
    type: String,
    max: 180
  },
  age: {
    type: Number,
    min: 16,
  },
  gender: {
    type: String,
    enum: GENDERS,
    required: 'The gender is required.'
  },
  occupation: String,
  password: String,
  nativeLanguage: {
    type: String,
    enum: LANGUAGES
  },
  languagesToLearn: [{
    type: String,
    enum: LANGUAGES
  }],
  level: {
    type: Number,
    min: 0,
  },
  languageLevel: {
    type: Number,
    min: 0,
  },
  groups: [ObjectId],
  events: [ObjectId],
  connections: [ObjectId],
  connectionRequests: [ObjectId],
  myConnectionRequests: [ObjectId],
  facebookAddress: String,
  facebookAvatar: String,
  facebookLikedPages: [Object],
  facebookGroups: [String],
  facebookMusic: [String],
  facebookMovies: [String],
  facebookBooks: [String],
  facebookSeries: [String],
  facebookSports: [String],
  facebookFriends: [String],
  instagramAccount: String,
  twitterAccount: String,
  skype: {
    type: String,
    max: 60
  },
  notifications: [ObjectId],
  messages: [ObjectId],
  contadorWithoutMessages: {
    type: Number,
    min: 0
  },
  contadorMessages: {
    type: Number,
    min: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
})

module.exports = mongoose.model('User', UserSchema)
