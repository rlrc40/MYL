const User = require('../models/User')
const Group = require('../models/Group')
const mongoose = require('mongoose')
const urlDB = "mongodb://localhost/myl"

const db = mongoose.connect(urlDB,  (err, res) => {
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
    User.find(
      {}, (err, users) => {
            if (err) res.send(500).send(err.name + ': ' + err.message)
            if (!users) res.status(404).send({message: "Not found users"})
            res.status(200).send({users})
    })
}

function getById(req, res) {
    let userId = req.params.userId
    User.findById(
        userId, (err, user) => {
            if (err) res.send(500).send(err.name + ': ' + err.message)
            if (!user) res.status(404).send({message: "User not found"})
            else res.status(200).send({user})
    })
}

function create(req, res) {
    let userParam = req.body
    let user = new User()

    user.name =  userParam.name
    user.email = userParam.email
    user.description = userParam.description
    user.age = userParam.age
    user.created_at = Date.now()
    user.gender = userParam.gender
  	user.occupation = userParam.occupation
  	user.password = userParam.password
  	user.nativeLanguage = userParam.nativeLanguage
  	user.languagesToLearn = [userParam.languagesToLearn]
  	user.facebookAddress = userParam.facebookAddress
  	user.facebookAvatar = userParam.facebookAvatar
  	user.facebookLikedPages = userParam.facebookLikedPages
  	user.facebookGroups = userParam.facebookGroups
  	user.facebookMusic = userParam.facebookMusic
  	user.facebookFilm = userParam.facebookFilm
  	user.facebookBooks = userParam.facebookBooks
  	user.facebookSeries = userParam.facebookSeries
  	user.facebookSports = userParam.facebookSports
  	user.facebookFriends = userParam.facebookFriends
  	user.instagramAccount = userParam.instagramAccount
  	user.twitterAccount = userParam.twitterAccount
  	user.skype = userParam.skype
  	user.notifications = []
    user.messages = 0
  	user.contadorWithoutMessages = 0
  	user.contadorMessages = 0
  	user.level = 0
  	user.languageLevel = 0
  	user.groups = []
  	user.receivedLikes = 0
  	user.givenLikes = 0

    user.save((err, userStored) => {
        if (err) res.status(500).send({message: 'Failed at store user in the database'})
        else res.status(200).send({message: 'User ' + userParam.name + ' has been created', user: userStored})
    })
}

function validateUser(req, res) {
    console.log('Validate user: ', req.body.email)
    let email = req.body.email

    User.findOne(
        { email: email }, (err, user) => {
            if (err) res.send(400).send(err.name + ': ' + err.message)

            if (user) {
                res.send(412).send({message: 'Email ' + email + ' is already taken'})
            } else {
                create(req, res)
            }
        }
    )
}

function update(req, res) {
  let userId = req.params.userId
  let update = req.body

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if (err || !userUpdated) res.send(500).send('Error at update user: ' + err.message)

    res.status(200).send({message: 'User ' + userUpdated.name + ' has been updated'})
  })
}

function _delete(req, res) {
  let userId = req.params.userId

  User.findById(userId, (err, user) => {
    if (err || !user) res.status(404).send({message: "Error at deleting user: " + userId + " not found"})
    user.remove(err => {
        if (err) res.status(500).send({message: "Error at deleting user: " + userId})
        res.status(200).send({message: "User has been deleted"})
    })
  })
}
