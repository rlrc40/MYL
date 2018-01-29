const mongoose = require('mongoose');
const User = require("./User");
const LANGUAGES = ["Spanish", "English", "Italian", "French", "Portuguese", "Deutsch", "Polish"]



const MeetingSchema = new mongoose.Schema({
  	creator: User,
  	avatar: String,
  	title: String,
  	locate: String,
  	date: Date,
  	description: String,
  	languages: [{ type: String, enum: LANGUAGES }],
  	followers: Number
});

module.exports = mongoose.model('Meeting', MeetingSchema);
