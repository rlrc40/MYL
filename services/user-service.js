const User = require('../models/User')
const Group = require('../models/Group')

var service = {}
service.create = validateUser
service.getAll = getAll
service.getById = getById
service.getUsersByGroupId = getUsersByGroupId
service.getUserConnections = getUserConnections
service.findUsersBySearch = findUsersBySearch
service.findUserByName = findUserByName
service.findUsersByFilter = findUsersByFilter
service.update = update
service.addConnection = addConnection
service.removeConnection = removeConnection
service._delete = _delete

module.exports = service

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
  user.languagesToLearn = userParam.languagesToLearn
  user.facebookAddress = userParam.facebookAddress
  user.facebookAvatar = userParam.facebookAvatar
  user.facebookLikedPages = userParam.facebookLikedPages
  user.facebookGroups = userParam.facebookGroups
  user.facebookMusic = userParam.facebookMusic
  user.facebookMovies = userParam.facebookMovies
  user.facebookBooks = userParam.facebookBooks
  user.facebookSeries = userParam.facebookSeries
  user.facebookSports = userParam.facebookSports
  user.facebookFriends = userParam.facebookFriends
  user.instagramAccount = userParam.instagramAccount
  user.twitterAccount = userParam.twitterAccount
  user.skype = userParam.skype
  user.notifications = []
  user.messages = []
  user.contadorWithoutMessages = 0
  user.contadorMessages = 0
  user.level = 0
  user.languageLevel = 0
  user.groups = []
  user.connections = []
  user.connectionRequests = []
  user.myConnectionRequests = []

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

function findUsersBySearch(req, res) {
  let searchBody = req.body
  let nativeLanguage = searchBody.nativeLanguage
  let languagesToLearn = searchBody.languagesToLearn
  let gender = searchBody.gender
  User.find({
    $and: [{
        nativeLanguage: nativeLanguage
      },
      {
        languagesToLearn: {
          $in: [languagesToLearn]
        }
      },
      {
        gender: gender
      }
    ]
  }, (err, users) => {
    if (err) return res.status(500).send(err.name + ': ' + err.message)
    if (!users) return res.status(404).send({
      message: "Users not found"
    })

    res.status(200).send(users)
  })
}

function findUserByName(req, res) {
  let searchName = req.body.name

  User.find({
    name: {
      $regex: ".*" + searchName + ".*"
    }
  }, (err, users) => {
    if (err) return res.status(500).send(err.name + ': ' + err.message)
    if (users.length == 0) return res.status(404).send({
      message: "Users not found"
    })

    res.status(200).send(users)
  })
}

function findUsersByFilter(req, res) {
  let facebookGroups = req.body.facebookGroups
  let facebookMusic = req.body.facebookMusic
  let facebookMovies = req.body.facebookMovies
  let facebookBooks = req.body.facebookBooks
  let facebookSeries = req.body.facebookSeries
  let facebookSports = req.body.facebookSports
  let facebookFriends = req.body.facebookFriends

  User.find({
    $and: [{
      facebookGroups: {
        $in: [facebookGroups]
      },
      facebookMusic: {
        $in: [facebookMusic]
      },
      facebookMovies: {
        $in: [facebookMovies]
      },
      facebookBooks: {
        $in: [facebookBooks]
      },
      facebookSeries: {
        $in: [facebookSeries]
      },
      facebookSports: {
        $in: [facebookSports]
      },
      facebookFriends: {
        $in: [facebookFriends]
      }
    }]
  }, (err, users) => {
    if (err) return res.status(500).send(err.name + ': ' + err.message)
    if (!users) return res.status(404).send({
      message: "Users not found"
    })

    res.status(200).send(users)
  })
}

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

function getUsersByGroupId(req, res) {
  let groupId = req.params.groupId
  User.find({
    groups: groupId
  }, (err, users) => {
    if (err) return res.status(500).send(err.name + ': ' + err.message)
    if (!users) return res.status(404).send({
      message: "Users not found"
    })

    res.status(200).send(users)
  })
}

function getUserConnections(req, res) {
  let userId = req.params.userId
  User.findById(
    userId, (err, user) => {
      if (err) return res.status(500).send(err.name + ': ' + err.message)
      if (!user) return res.status(404).send({
        message: "User not found"
      })

      User.find({
        _id: user.connections
      }, (err, users) => {
        if (err) return res.status(500).send(err.name + ': ' + err.message)
        if (!users) return res.status(404).send({
          message: "Users not found "
        })
        res.status(200).send(users)
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

function addConnection(req, res) {
  let userId = req.params.userId
  let newConnection = req.body.connectionId

  User.update({
    "_id": userId
  }, {
    $push: {
      "connections": newConnection
    }
  }, (err, result) => {
    if (err) return res.status(500).send({
      message: 'Error at add user: ' + err.message
    })
    if (result.nModified == 0) return res.status(404).send({
      message: 'User not found'
    })

    res.status(200).send({
      message: 'The User has been added',
      result: result
    })
  })
}

function removeConnection(req, res) {
  let userId = req.params.userId
  let deleteConnection = req.body.connectionId

  User.update({
    "_id": userId
  }, {
    $pop: {
      "connections": deleteConnection
    }
  }, (err, result) => {
    if (err) return res.status(500).send({
      message: 'Error at remove user: ' + err.message
    })
    if (result.nModified == 0) return res.status(404).send({
      message: 'User not found'
    })
    res.status(200).send({
      message: 'The User has been removed',
      result: result
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

      user.groups.map(function(groupId) {
        Group.findByIdAndUpdate(groupId, {
            $pull: {
              members: userId
            }
          },
          (err, groupUpdate) => {
            if (err) return res.status(500).send({
              message: 'Error at updating group: ' + err.message
            })
            if (!groupUpdate) return res.status(404).send({
              message: 'Group not found'
            })
          })
      })
      res.status(200).send({
        message: "User has been deleted"
      })
    })
  })
}
