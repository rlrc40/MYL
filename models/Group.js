const mongoose = require('mongoose')
const User = require("./User")
const Comment = require("./Comment")
const LANGUAGES = ["Spanish", "English", "Italian", "French", "Portuguese", "Deutsch", "Polish"]

const CommentSchema = mongoose.model('Comment').schema

const GroupSchema = new mongoose.Schema({
  creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
	name: String,
	description: String,
	avatar: String,
	languages: [{ type: String, enum: LANGUAGES }],
	comments: [CommentSchema],
	members: [User],
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Group', GroupSchema);
