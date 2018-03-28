const Notification = require('../models/Notification')

var service = {}
service.getNotificationsByUserId = getNotificationsByUserId
service.create = create
service.update = update
service.changeState = changeState
service._delete = _delete

module.exports = service



function getNotificationsByUserId(req, res) {
  let userId = req.params.userId
  Notification.find({
    user: userId
  }, (err, notifications) => {
    if (err) return res.status(500).send(err.name + ': ' + err.message)
    if (!notifications) return res.status(404).send({
      notification: "Not found notifications"
    })
    res.status(200).send(notifications)
  })
}

function create(req, res) {
  let notificationParam = req.body
  let notification = new Notification()

  notification.user = notificationParam.user
  notification.type = notificationParam.type
  notification.url = notificationParam.url
  notification.text = notificationParam.text
  notification.visited = false
  notification.created_at = Date.now()


  notification.save((err, notificationSent) => {
    if (err) return res.status(500).send({
      information: 'Error when sending the notification to the database'
    })
    res.status(200).send({
      information: 'Notification has been sent',
      notification: notificationSent
    })
  })
}

function update(req, res) {
  let notificationId = req.params.notificationId
  let update = req.body

  Notification.findByIdAndUpdate(notificationId, update, {
    new: true
  }, (err, notificationUpdated) => {
    if (err) return res.status(500).send({
      information: 'Error at update notification: ' + err.message
    })
    if (!notificationUpdated) return res.status(404).send({
      information: 'Notification not found'
    })
    res.status(200).send({
      information: 'Notification has been updated',
      notification: notificationUpdated
    })
  })
}

function changeState(req, res) {
  let notificationId = req.params.notificationId
  let notificationState = Notification.findOne({
    id: notificationId
  }).visited;


  Notification.update({
    "_id": notificationId
  }, {
    visited: !notificationState
  }, (err, result) => {
    if (err) return res.status(500).send({
      information: 'Error at change state: ' + err.message
    })
    if (result.nModified == 0) return res.status(404).send({
      information: 'Notification not found'
    })
    res.status(200).send({
      information: 'The state of notification has been changed',
      result: result
    })
  })
}

function _delete(req, res) {
  let notificationId = req.params.notificationId

  Notification.findById(notificationId, (err, notification) => {
    if (err) return res.status(500).send({
      information: 'Error at update notification: ' + err.message
    })
    if (!notification) return res.status(404).send({
      information: 'Notification not found'
    })

    notification.remove(err => {
      if (err) return res.status(500).send({
        information: "Error at deleting notification: " + notificationId
      })

      res.status(200).send({
        information: "Notification has been deleted"
      })
    })
  })
}
