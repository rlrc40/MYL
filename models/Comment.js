const mongoose = require('mongoose');
const User = require("./User");
const Comment = require("./Comment");

const CommentSchema = new mongoose.Schema({
	from: User,
	text: String,
  likes: Number,
  answers: [Comment],
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema);
