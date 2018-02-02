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
service.getAllGroups = getAllGroups
service.getGroupById = getGroupById
service.getGroupMembers = getGroupMembers
service.create = validateGroupName
service.update = update
service._delete = _delete

module.exports = service


function getAllGroups(req, res) {
    Group.find(
      {}, (err, groups) => {
            if (err) res.send(500).send(err.name + ': ' + err.message)
            if (!groups) res.status(404).send({message: "No groups found"})
            res.status(200).send({groups})
    })
}

function getGroupById(req, res) {
    let groupId = req.params.groupId
    Group.findById(
        groupId, (err, group) => {
            if (err) res.send(500).send(err.name + ': ' + err.message)
            if (!group) res.status(404).send({message: "Group not found"})
            else res.status(200).send({group})
    })
}

function getGroupMembers(req, res) {
    let groupId = req.params.groupId
    Group.findById(
        groupId, 'members', (err, members) => {
            if (err) res.send(500).send(err.name + ': ' + err.message)
            if (!group) res.status(404).send({message: "Group not found"})
            else res.status(200).send({members})
    })
}

function create(req, res) {
    let groupParam = req.body
    let group = new Group()

    group.creator =  groupParam.creator
    group.name = groupParam.name
    group.description = groupParam.description
    group.avatar = groupParam.avatar
    group.languages = groupParam.languages
    group.comments = groupParam.comments
    group.members = groupParam.members
    group.created_at = Date.now()


    group.save((err, groupStored) => {
        if (err) res.status(500).send({message: 'Error when saving the group in the database'})
        else res.status(200).send({message: 'Group ' + groupParam.name + ' has been created', group: groupStored})
    })
}

function validateGroupName(req, res) {
    console.log('Validate group name: ', req.body.name)
    let name = req.body.name

    Group.findOne(
        {name: name}, (err, group) => {
            if (err) res.send(400).send(err.name + ': ' + err.message)

            if (group) {
                res.send(412).send({message: 'Group name ' + name + ' is already taken'})
            } else {
                create(req, res)
            }
        }
    )
}

function update(req, res) {
  let groupId = req.params.groupId
  let update = req.body

  Group.findByIdAndUpdate(groupId, update, (err, groupUpdated) => {
    if (err || !groupUpdated) res.send(500).send('Error updating the group: ' + err.message)

    res.status(200).send({message: 'Group ' + groupUpdated.name + ' has been updated'})
  })
}

function _delete(req, res) {
  let groupId = req.params.groupId

  Group.findById(groupId, (err, group) => {
    if (err || !group) res.status(404).send({message: "Error deleting group: " + groupId + " not found"})
    group.remove(err => {
        if (err) res.status(500).send({message: "Error deleting group: " + groupId})
        res.status(200).send({message: "Group has been deleted"})
    })
  })
}
