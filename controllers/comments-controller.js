const express = require('express')
const router = express.Router()
const commentService = require('../services/comment-service.js')

module.exports = router

// routes
router.post('/create', create)
router.get('/:commentId', getById)
router.put('/:commentId', update)
router.delete('/:commentId', _delete)



// POST
function create(req, res) {
    commentService.create(req, res)
}

// GET
function getById(req, res) {
    commentService.getById(req, res)
}

// PUT
function update(req, res) {
    commentService.update(req, res)
}

// DELETE
function _delete(req, res) {
    commentService._delete(req, res)
}
