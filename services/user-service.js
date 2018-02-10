const User = require('../models/User')
const mongoose = require('mongoose')
const urlDB = "mongodb://localhost/myl"

const db = mongoose.connect(urlDB, (err, res) => {
  if (err) {
    return console.log("Error al conectar con la base de datos")
  }
  console.log('Conexión con la base de datos establecida')
})

var service = {}
service.getAll = getAll
service.getById = getById
service.create = validateUser
service.update = update
service._delete = _delete

module.exports = service


function getAll(req, res) {
  User.find({}, (err, users) => {
    if (err) return res.status(500).send(err.name + ': ' + err.message)
    if (!users) return res.status(404).send({
      message: "Not found users"
    })
    res.status(200).send(users)
  })
}

function getById(req, res) {
  let userId = req.params.userId
  User.findById(
    userId, (err, user) => {
      if (err) return res.status(500).send(err.name + ': ' + err.message)
      if (!user) return res.status(404).send({
        message: "User not found"
      })

      res.status(200).send(user)
    })
}

function create(req, res) {
  let userParam = req.body
  let user = new User()

  user.name = userParam.name
  user.email = userParam.email
  user.description = userParam.description
  user.age = userParam.age
  user.created_at = Date.now()
  user.gender = userParam.gender
  user.occupation = userParam.occupation
  user.password = userParam.password
  user.nativeLanguage = userParam.nativeLanguage
  user.languagesToLearn = [userParam.languagesToLearn]
  user.address = userParam.facebookAddress
  user.avatar = userParam.facebookAvatar
  user.likedPages = userParam.facebookLikedPages
  user.facebookGroups = userParam.facebookGroups
  user.music = userParam.facebookMusic
  user.films = userParam.facebookFilms
  user.books = userParam.facebookBooks
  user.series = userParam.facebookSeries
  user.sports = userParam.facebookSports
  user.friends = userParam.facebookFriends
  user.instagramAccount = userParam.instagramAccount
  user.twitterAccount = userParam.twitterAccount
  user.skype = userParam.skype
  user.contadorWithoutMessages = 0
  user.contadorMessages = 0
  user.level = 0
  user.languageLevel = 0
  user.groups = []
  user.receivedLikes = 0
  user.givenLikes = 0

  user.save((err, userStored) => {
    if (err) return res.status(500).send({
      message: 'Failed at store user in the database'
    })

    res.status(200).send({
      message: 'User ' + userParam.name + ' has been created',
      user: userStored
    })
  })
}

function validateUser(req, res) {
  let email = req.body.email

  User.findOne({
    email: email
  }, (err, user) => {

    if (user) return res.status(412).send({
      message: 'Email ' + email + ' is already taken'
    })
    else if (err) return res.status(400).send(err.name + ': ' + err.message)

    create(req, res)
  })
}

function update(req, res) {
  let userId = req.params.userId
  let update = req.body

  User.findByIdAndUpdate(userId, update, {
    new: true
  }, (err, userUpdated) => {
    if (err) return res.status(500).send({
      message: 'Error at update user: ' + err.message
    })
    if (!userUpdated) return res.status(404).send({
      message: 'User not found'
    })

    res.status(200).send({
      message: 'User ' + userUpdated.name + ' has been updated',
      user: userUpdated
    })
  })
}

function _delete(req, res) {
  let userId = req.params.userId

  User.findById(userId, (err, user) => {
    if (err) return res.status(500).send({
      message: 'Error at update user: ' + err.message
    })
    if (!user) return res.status(404).send({
      message: "Error at deleting user: " + userId + " not found"
    })

    user.remove(err => {
      if (err) return res.status(500).send({
        message: "Error at deleting user: " + userId
      })
      res.status(200).send({
        message: "User has been deleted"
      })
    })
  })
}
