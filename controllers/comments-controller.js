const express = require('express')
const router = express.Router()
const commentService = require('../services/comment-service.js')

module.exports = router

// routes
router.get('/', getAll)
router.get('/:commentId', getCommentById)
router.get('/discussion/:discussionId', getCommentByDiscussionId)
router.get('/find/:slug', findCommentBySlug)
router.post('/post', postComment)
router.post('/post/:parentId', postReply)
router.put('/:commentId', update)
router.delete('/:commentId', _delete)

// POST
function postComment(req, res) {
    commentService.postComment(req, res)
}

function postReply(req, res) {
    commentService.postReply(req, res)
}

// GET
function getAll(req, res) {
    commentService.getAll(req, res)
}

function findCommentBySlug(req, res) {
    commentService.findCommentBySlug(req, res)
}

function getCommentByDiscussionId(req, res) {
    commentService.getCommentByDiscussionId(req, res)
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
