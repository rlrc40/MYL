const mongoose = require('mongoose');
const User = require("./User");
const Comment = require("./Comment");
const TYPES = ["message", "comment", "new-conexion", "like", "request-access-group", "accept-request-group", "dropout-group", "access-denied", "welcome"];


const NotificationSchema = new mongoose.Schema({
	type: { type: String, enum: TYPES },
	url: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', NotificationSchema);
