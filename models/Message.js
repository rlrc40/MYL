const mongoose = require('mongoose');
const User = require("./User");



const MessageSchema = new mongoose.Schema({
	from: User,
	to: User,
	text: String,
	answers: [this],
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
