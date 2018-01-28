const mongoose = require('mongoose');
const User = require("./User");
const Comment = require("./Comment");
const LANGUAGES = ["Spanish", "English", "Italian", "French", "Portuguese", "Deutsch", "Polish"];

const UserSchema = require('mongoose').model('User').schema
const CommentSchema = require('mongoose').model('Comment').schema

const GroupSchema = new mongoose.Schema({
  creator: UserSchema,
	name: String,
	description: String,
	avatar: String,
	languages: { type: String, enum: LANGUAGES },
	comments: [CommentSchema],
	members: [UserSchema],
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Group', GroupSchema);
