const Comment = require('../models/Comment')
const mongoose = require('mongoose')
const urlDB = "mongodb://localhost/myl"

const db = mongoose.connect(urlDB, (err, res) => {
  if (err) {
    return console.log("Error al conectar con la base de datos")
  }
  console.log('Conexión con la base de datos establecida')
})

var service = {}
service.getById = getById
service.create = create
service.update = update
service._delete = _delete

module.exports = service

function getById(req, res) {
  let commentId = req.params.commentId
  Comment.findById(
    commentId, (err, comment) => {
      if (err) return res.status(500).send(err.name + ': ' + err.message)
      if (!comment) return res.status(404).send({
        message: "Comment not found"
      })

      res.status(200).send(comment)
    })
}

function create(req, res) {
  let commentParam = req.body
  let comment = new Comment()

  comment.from = commentParam.from
  comment.text = commentParam.text
  comment.likes = 0
  comment.answers = []

  comment.save((err, commentStored) => {
    if (err) return res.status(500).send({
      message: 'Failed at store comment in the database'
    })

    res.status(200).send({
      message: 'Comment has been created',
      comment: commentStored
    })
  })
}

function update(req, res) {
  let commentId = req.params.commentId
  let update = req.body

  Comment.findByIdAndUpdate(commentId, update, {
    new: true
  }, (err, commentUpdated) => {
    if (err) return res.status(500).send({
      message: 'Error at update comment: ' + err.message
    })
    if (!commentUpdated) return res.status(404).send({
      message: 'Comment not found'
    })

    res.status(200).send({
      message: 'Comment ' + commentUpdated.name + ' has been updated',
      comment: commentUpdated
    })
  })
}

function _delete(req, res) {
  let commentId = req.params.commentId

  Comment.findById(commentId, (err, comment) => {
    if (err) return res.status(500).send({
      message: 'Error at update comment: ' + err.message
    })
    if (!comment) return res.status(404).send({
      message: "Error at deleting comment: " + commentId + " not found"
    })

    comment.remove(err => {
      if (err) return res.status(500).send({
        message: "Error at deleting comment: " + commentId
      })

      comment.answers.map(function(answer) {
        Comment.findById(answer, (err, ans) => {
          ans.remove(err => {})
            if (err) return res.status(500).send({
              message: "Error at deleting answer: " + commentId
            })
        })
      })

      res.status(200).send({
        message: "Comment has been deleted"
      })
    })
  })
}
