const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const Notification = mongoose.Schema.Types.Notification
const GENDERS = ["M", "F"]
const LANGUAGES = ["Spanish", "English", "Italian", "French", "Portuguese", "Deutsch", "Polish"]

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required',
    max: 100
  },
  email: {
    type: String,
    required: 'Email address is required',
    match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please fill a valid email address']
  },
  description: {
    type: String,
    max: 160
  },
  age: {
    type: Number,
    min: 13
  },
  gender: {
    type: String,
    required: 'gender is required',
    enum: GENDERS
  },
  occupation: {
    type: String,
    max: 60
  },
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
    min: 0
  },
  languageLevel: {
    type: Number,
    min: 0
  },
  receivedLikes: {
    type: Number,
    min: 0
  },
  givenLikes: {
    type: Number,
    min: 0
  },
  address: {
    type: String,
    max: 100
  },
  avatar: {
    type: String
  },
  likedPages: [Object],
  facebookGroups: [Object],
  groups: [ObjectId],
  music: [Object],
  films: [Object],
  books: [Object],
  series: [Object],
  sports: [Object],
  friends: [Object],
  instagramAccount: String,
  twitterAccount: String,
  skype: String,
  contadorWithoutMessages: {
    type: Number,
    min: 0
  },
  contadorMessages: {
    type: Number,
    min: 0
  },
  notifications: {
    type: [Notification]
  },
  created_at: {
    type: Date,
    default: Date.now
  },
})

module.exports = mongoose.model('User', UserSchema)
