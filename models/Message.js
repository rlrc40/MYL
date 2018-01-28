const mongoose = require('mongoose');
const User = require("./User");

const MessagenSchema = new mongoose.Schema({
	from: User,
	to: User,
	text: String,
	answers: [Message],
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
