const User = require('../models/User')
const Comment = require('../models/Comment')

var service = {}

service.getAll = getAll
service.getCommentById = getCommentById
service.findCommentBySlug = findCommentBySlug
service.getCommentByDiscussionId = getCommentByDiscussionId
service.postComment = postComment
service.postReply = postReply
service.update = update
service._delete = _delete

module.exports = service

function getCommentById(req, res) {
  let commentId = req.params.commentId

  Comment.findById(
    commentId, (err, comment) => {
      if (err) return res.status(500).send(err.name + ': ' + err.message)
      if (!comment) return res.status(404).send({
        message: 'Comment not found'
      })

      res.status(200).send(comment)
    })
}

function getAll(req, res) {
  Comment.find({}, (err, comments) => {
      if (err) return res.status(500).send(err.name + ': ' + err.message)
      if (!comments) return res.status(404).send({
        message: 'Comment not found'
      })

      res.status(200).send(comments)
    })
}

function getCommentByDiscussionId(req, res) {
  let discussionId = req.params.discussionId

  Comment.find({
      discussion_id:  discussionId
    }, (err, comment) => {
      if (err) return res.status(500).send(err.name + ': ' + err.message)

      if (!comment) return res.status(404).send({
        message: 'Comment not found'
      })

      res.status(200).send(comment)
    })
}

function findCommentBySlug(req, res) {
  let commentSlug = req.params.commentSlug

  Comment.find({
      slug:  commentSlug
    }, (err, comment) => {
      if (err) return res.status(500).send(err.name + ': ' + err.message)

      if (!comment) return res.status(404).send({
        message: 'Comment not found'
      })

      res.status(200).send(comment)
    })
}

function postComment(req, res) {
  let commentParam = req.body
  let comment = new Comment()

	comment.author = commentParam.author
	comment.discussion_id = commentParam.discussion_id
	comment.discussion_childs = []
	comment.slug = commentParam.slug
	comment.bodyText = commentParam.bodyText
	comment.posted = Date.now


  comment.save((err, commentStored) => {
    if (err) return res.status(500).send({
      message: 'Error storing comment in the database: ' + err
    })

    res.status(200).send({
      message: 'Comment stored',
      comment: commentStored
    })
  })
}

function postReply(req, res) {
  let parentId = req.params.parentId
  let commentParam = req.body
  let comment = new Comment()

  comment.author = commentParam.author
  comment.discussion_id = commentParam.discussion_id
  comment.discussion_childs = []
  comment.bodyText = commentParam.bodyText
  comment.posted = Date.now


  comment.save((err, commentStored) => {
    if (err) return res.status(500).send({
      message: 'Error storing comment reply in the database'
    })

    updateParent(parentId, commentStored.id)

    res.status(200).send({
      message: 'Comment reply stored',
      comment: commentStored
    })
  })
}

function updateParent(parentId, childId) {

  Comment.findByIdAndUpdate(parentId,
      { $addToSet: {discussion_childs: childId} },
      (err, parentUpdated) => {
        if (err) return res.status(500).send(
          'Error updating the parent: ' + err.message
        )
        if (!parentUpdated) return res.status(404).send({
          message: 'Parent not found'
        })
        console.log('Parent updated:' + parentUpdated)
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
      message: 'Error: ' + err.message
    })
    if (!comment) return res.status(404).send({
      message: 'Comment not found'
    })

    comment.remove(err => {
      if (err) return res.status(500).send({
        message: 'Error removing comment: ' + commentId
      })

	comment.discussion_childs.map(function(answer) {
        Comment.findById(answer, (err, ans) => {
          ans.remove(err => {})
            if (err) return res.status(500).send({
              message: 'Error at deleting answer: ' + commentId
            })
        })
      })

      res.status(200).send({
        message: 'Comment has been deleted'
      })
    })
  })
}
