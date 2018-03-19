const express = require('express')
const router = express.Router()
const commentService = require('../services/comment-service.js')

module.exports = router

// routes
router.post('/post', postComment)
router.post('/reply', postReply)
router.get('/:slug', getCommentBySlug)
router.get('/:commentId', getCommentById)
router.put('/:slug', update)
router.delete('/:slug', _delete)

// POST
function postComment(req, res) {
    commentService.postComment(req, res)
}

function postReply(req, res) {
    commentService.postReply(req, res)
}

// GET
function getCommentBySlug(req, res) {
    commentService.getBySlug(req, res)
}

function getCommentById(req, res) {
    commentService.getCommentById(req, res)
}

// PUT
function update(req, res) {
    commentService.update(req, res)
}

// DELETE
function _delete(req, res) {
    commentService._delete(req, res)
}
