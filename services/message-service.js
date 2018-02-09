const User = require('../models/User')
const Group = require('../models/Group')
const Message = require('../models/Message')
const mongoose = require('mongoose')
const urlDB = "mongodb://localhost/myl"

const db = mongoose.connect(urlDB,  (err, res) => {
    if (err) {
        return console.log("Error al conectar con la base de datos")
    }
    console.log('Conexión con la base de datos establecida')

})

var service = {}
service.getMessageById = getMessageById
service.create = create
service.update = update
service._delete = _delete

module.exports = service


function create(req, res) {
    let messageParam = req.body
    let message = new Message()

    message.from =  messageParam.from
    message.to = messageParam.to
    message.text = messageParam.text
    message.answers = []
    message.created_at = Date.now()


    message.save((err, messageSent) => {
        if (err) res.status(500).send({information: 'Error when sending the message to the database'})
        else res.status(200).send({information: 'Message has been sent', message: messageSent})
    })
}

function update(req, res) {
  let messageId = req.params.messageId
  let update = req.body

  Message.findByIdAndUpdate(messageId, update, {new: true}, (err, messageUpdated) => {
    if (err || !messageUpdated) res.status(500).send('Error updating the message: ' + err.message)
    else res.status(200).send({information: 'Message to ' + messageUpdated.to + ' has been updated', message: messageUpdated})
  })
}

function _delete(req, res) {
  let messageId = req.params.messageId

  Message.findById(messageId, (err, message) => {
    if (err || !message) res.status(404).send({information: "Error deleting message: " + messageId + " not found"})
    else message.remove(err => {
      if (err) res.status(500).send({information: "Error deleting group: " + messageId})
      res.status(200).send({information: "Message has been deleted"})
    })
  })
}

function getMessageById(req, res) {
    let messageId = req.params.messageId
    Message.findById(
        messageId, (err, message) => {
            if (err) res.send(500).send(err.name + ': ' + err.message)
            if (!message) res.status(404).send({information: "Message not found"})
            else res.status(200).send(message)
    })
}
