const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const GENDERS = ["M", "F"]
const LANGUAGES = ["Spanish", "English", "Italian", "French", "Portuguese", "Deutsch", "Polish"]

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  description: String,
  age: Number,
  gender: { type: String, enum: GENDERS },
	occupation: String,
	password: String,
	nativeLanguage: { type: String, enum: LANGUAGES },
	languagesToLearn: [{ type: String, enum: LANGUAGES }],
	level: Number,
	languageLevel: Number,
	groups: [ObjectId],
  connections: [ObjectId],
  connectionRequests: [ObjectId],
  myConnectionRequests: [ObjectId],
	facebookAddress: String,
	facebookAvatar: String,
	facebookLikedPages: [Object],
	facebookGroups: [Object],
	facebookMusic: [Object],
	facebookFilm: [Object],
	facebookBooks: [Object],
	facebookSeries: [Object],
	facebookSports: [Object],
	facebookFriends: [Object],
	instagramAccount: String,
	twitterAccount: String,
	skype: String,
	notifications: [ObjectId],
  messages: [ObjectId],
	contadorWithoutMessages: Number,
	contadorMessages: Number,
  created_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('User', UserSchema)
