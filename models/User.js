const mongoose = require('mongoose');
const Group = require("./Group");
const Notification = require("./Notification");
const Message = require("./Message");
const GENDERS = ["M", "F"];
const LANGUAGES = ["Spanish", "English", "Italian", "French", "Portuguese", "Deutsch", "Polish"];

const GroupSchema = require('mongoose').model('Group').schema
const NotificationSchema = require('mongoose').model('Notification').schema
const MessageSchema = require('mongoose').model('Message').schema

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
	groups: [GroupSchema],
	receivedLikes: Number,
	givenLikes: Number,
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
	notifications: [NotificationSchema],
  messages: [MessageSchema],
	contadorWithoutMessages: Number,
	contadorMessages: Number,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
