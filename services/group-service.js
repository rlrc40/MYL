const User = require('../models/User')
const Group = require('../models/Group')

var service = {}
service.getAllGroups = getAllGroups
service.findGroupById = findGroupById
service.findGroupsByUserId = findGroupsByUserId
service.findGroupsByName = findGroupsByName
service.findGroupsBySearch = findGroupsBySearch
service.findGroupsByFilter = findGroupsByFilter
service.create = validateGroupName
service.update = update
service.addMember = addMember
service.removeMember = removeMember
service._delete = _delete

module.exports = service


function getAllGroups(req, res) {
    Group.find(
      {}, (err, groups) => {
            if (err) return res.status(500).send(
              err.name + ': ' + err.message
            )
            if (!groups) return res.status(404).send({
              message: "No groups found"
            })
            res.status(200).send({
              groups
            })
    })
}

function findGroupsByUserId(req, res) {
    let userId = req.params.userId
    Group.find(
      { members: userId },(err, groups) => {
            if (err) return res.status(500).send(
              err.name + ': ' + err.message
            )
            if (!groups) return res.status(404).send({
              message: "Groups not found"
            })
            res.status(200).send({
              groups
            })
    })
}

function findGroupById(req, res) {
    let groupId = req.params.groupId
    Group.findById(
        groupId, (err, group) => {
            if (err) return res.status(500).send(
              err.name + ': ' + err.message
            )
            if (!group) return res.status(404).send({
              message: "Group not found"
            })
            res.status(200).send({
              group
            })
    })
}

function findGroupsByFilter(req, res) {
    let languages = new RegExp(req.body.languages, 'i')
    Group.find(
      { languages: {$regex: languages} },
      (err, groups) => {
            if (err) return res.status(500).send(
              err.name + ': ' + err.message
            )
            if (!groups) return res.status(404).send({
              message: "Groups not found"
            })
            res.status(200).send({
              groups
            })
    })
}

function findGroupsByName(req, res) {
    let name = new RegExp(req.body.name, 'i')
    Group.find(
      { name: {$regex: name} },
      (err, groups) => {
            if (err) return res.status(501).send(
              err.name + ': ' + err.message
            )
            if (!groups) return res.status(404).send({
              message: "Groups not found"
            })
            res.status(200).send({
              groups
            })
    })
}

function findGroupsBySearch(req, res) {
    let search = new RegExp(req.body.search, 'i')
    Group.find({
      $or: [
        { name: {$regex: search} },
        { description: {$regex: search} },
        { languages: {$regex: search} }
      ]
    }, (err, groups) => {
            if (err) return res.status(500).send(
              err.name + ': ' + err.message
            )
            if (!groups) return res.status(404).send({
              message: "Groups not found"
            })
            res.status(200).send({
              groups
            })
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
    group.members = [groupParam.creator]
    group.created_at = Date.now()


    group.save((err, groupStored) => {

        if (err) return res.status(500).send({
          message: 'Error when saving the group in the database'
        })

        groupStored.members.map(memberId => {

          User.findByIdAndUpdate(memberId,
            { $addToSet: { groups: groupStored.id} },
             (err, memberUpdated) => {
                if (err) return res.status(500).send({
                  message: 'Error updating member: ' + err.message
                })
                if (!memberUpdated) return res.status(404).send({
                  message: 'Member not found'
                })
            })
        })

        res.status(200).send({
          message: 'Group ' + groupParam.name + ' has been created',
          group: groupStored
        })
    })
}

function validateGroupName(req, res) {
    let name = req.body.name

    Group.findOne(
        {name}, (err, group) => {
            if (group) return res.status(412).send({
              message: 'Group name is already taken'
            })
            if (err) return res.status(500).send(
              err.name + ': ' + err.message
            )
            create(req, res)
        }
    )
}

function update(req, res) {
    let groupId = req.params.groupId
    let update = req.body

    Group.findByIdAndUpdate(groupId, update, (err, groupUpdated) => {
      if (err) return res.status(500).send(
        'Error updating the group: ' + err.message
      )
      if (!groupUpdated) return res.status(404).send({
        message: 'Group not found'
      })
      res.status(200).send({
        message: 'Group has been updated'
      })
    })
}

function addMember(req, res) {
    let userId = req.params.userId
    let groupId = req.params.groupId

    Group.findByIdAndUpdate(groupId,
      { $push: {members: userId}},
      (err, groupUpdated) => {
        if (err) return res.status(500).send(
          'Error updating the group: ' + err.message
        )
        if (!groupUpdated) return res.status(404).send({
          message: 'Group not found'
        })
        res.status(200).send({
          message: 'Member has been removed'
        })
    })
}

function removeMember(req, res) {
    let userId = req.params.userId
    let groupId = req.params.groupId

    Group.findByIdAndUpdate(groupId,
      { $pull: {members: userId}},
      (err, groupUpdated) => {
        if (err) return res.status(500).send(
          'Error updating the group: ' + err.message
        )
        if (!groupUpdated) return res.status(404).send({
          message: 'Group not found'
        })
        res.status(200).send({
          message: 'Member has been removed'
        })
    })
}

function _delete(req, res) {
  let groupId = req.params.groupId

  Group.findById(groupId, (err, group) => {
    if (err) return res.status(500).send({
      message: "Error deleting group: " + err.message
    })
    if (!group) return res.status(404).send({
      message: "Error deleting group: " + groupId + " not found"
    })
    group.remove(err => {
      if (err) return res.status(500).send({
        message: "Error deleting group: " + groupId
      })

      group.members.map(memberId => {

        User.findByIdAndUpdate(memberId,
          { $pull: { groups: groupId}},
           (err, memberUpdated) => {
              if (err) return res.status(500).send({
                message: 'Error at updating member: ' + err.message
              })
              if (!memberUpdated) return res.status(404).send({
                message: 'Member not found'
              })
          })
      })

      res.status(200).send({
        message: "Group has been deleted"
      })
    })
  })
}
