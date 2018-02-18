const Message = require('../models/Message')

var service = {}
service.getMessageById = getMessageById
service.getMessagesByUserId = getMessagesByUserId
service.create = create
service.update = update
service._delete = _delete

module.exports = service



function getMessagesByUserId(req, res) {
  let userId = req.params.userId
  Message.find({
    $or: [{
      "from": userId
    }, {
      "to": userId
    }]
  }, (err, messages) => {
    if (err) return res.status(500).send(err.name + ': ' + err.message)
    if (!messages) return res.status(404).send({
      message: "Not found messages"
    })
    res.status(200).send(messages)
  })
}

function getMessageById(req, res) {
  let messageId = req.params.messageId
  Message.findById(
    messageId, (err, message) => {
      if (err) return res.status(500).send(err.name + ': ' + err.message)
      if (!message) return res.status(404).send({
        information: "Message not found"
      })
      res.status(200).send(message)
    })
}

function create(req, res) {
  let messageParam = req.body
  let message = new Message()

  message.from = messageParam.from
  message.to = messageParam.to
  message.text = messageParam.text
  message.answers = []
  message.created_at = Date.now()


  message.save((err, messageSent) => {
    if (err) return res.status(500).send({
      information: 'Error when sending the message to the database'
    })
    res.status(200).send({
      information: 'Message has been sent',
      message: messageSent
    })
  })
}

function update(req, res) {
  let messageId = req.params.messageId
  let update = req.body

  Message.findByIdAndUpdate(messageId, update, {
    new: true
  }, (err, messageUpdated) => {
    if (err) return res.status(500).send({
      information: 'Error at update message: ' + err.message
    })
    if (!messageUpdated) return res.status(404).send({
      information: 'Message not found'
    })
    res.status(200).send({
      information: 'Message to ' + messageUpdated.to + ' has been updated',
      message: messageUpdated
    })
  })
}

function _delete(req, res) {
  let messageId = req.params.messageId

  Message.findById(messageId, (err, message) => {
    if (err) return res.status(500).send({
      information: 'Error at update message: ' + err.message
    })
    if (!message) return res.status(404).send({
      information: 'Message not found'
    })

    message.remove(err => {
      if (err) return res.status(500).send({
        information: "Error at deleting message: " + messageId
      })

      message.answers.map(function(answer) {
        Message.findById(answer, (err, ans) => {
          ans.remove(err => {})
          if (err) return res.status(500).send({
            information: "Error at deleting answer: " + messageId
          })
        })
      })

      res.status(200).send({
        information: "Message has been deleted"
      })
    })
  })
}
