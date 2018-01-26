const express = require('express');
const router = express.Router();
const userService = require('../services/user-service.js');

module.exports = router;

// routes
router.post('/register', register);
router.get('/', getAll);
router.get('/:_id', getById);
router.put('/:_id', update);
router.delete('/:_id', _delete);



// POST
function register(req, res) {
    console.log('Controller register: ', req.body);
    userService.create(req, res);
        // .then(function () {
        //     res.sendStatus(200);
        // })
        // .catch(function (err) {
        //     res.status(400).send(err);
        // });
}

// GET
function getAll(req, res) {
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    userService.getById(req.params._id)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

// PUT
function update(req, res) {
    userService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

// DELETE
function _delete(req, res) {
    userService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}