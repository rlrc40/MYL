const User = require('../models/User');
const mongoose = require('mongoose');
const urlDB = "mongodb://localhost/myl";

const db = mongoose.connect(urlDB,  (err, res) => {
    if (err) {
        return console.log("Error al conectar con la base de datos");
    }
    console.log('Conexión con la base de datos establecida');

});

var service = {};
service.getAll = getAll;
// service.getById = getById;
service.create = validateUser;
// service.update = update;
service.delete = _delete;

module.exports = service;


function getAll(req, res) {
    User.find(
      {}, (err, users) => {
            if (err) res.send(500, err.name + ': ' + err.message);
            if (!users) res.status(404).send({message: "Not found users"});
            res.status(200).send({users});
    })
}

function create(req, res) {
    let userParam = req.body;
    let user = new User();

    user.name =  userParam.name;
    user.email = userParam.email;
    user.description = userParam.description;
    user.age = userParam.age;
    user.created_at = Date.now();

    console.log('Create user: ', user);

    user.save((err, userStored) => {
        if (err) res.status(500).send({message: 'Failed at store user in the database'});

        res.status(200).send({user: userStored});
    });
}

function validateUser(req, res) {
    console.log('Validate user: ', req.body.email);
    let email = req.body.email;

    User.findOne(
        { email: email }, (err, user) => {
            if (err) res.send(400, err.name + ': ' + err.message);

            if (user) {
                res.send(412, 'Email "' + email + '" is already taken');
            } else {
                create(req, res);
            }
        }
    );
}

//TO DO
function _delete(req, res) {
  let userId = req.params.userId;

  User.findById(userId, (err, user) => {
    if (err) res.status(404).send({message: "Error at deleting user: " + userId})

    user.remove(err => {
      if (err) res.status(500).send({message: "Error at deleting user: " + userId})
      res.status(200).send({message: "User has been deleted"})
    })
  })
}
