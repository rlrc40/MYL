const User = require('../models/User');
const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost/talketin',  (err, res) => {  
    if (err) {
        return console.log("Error al conectar con la base de datos");
    }
    console.log('Conexión con la base de datos establecida');

});

var service = {};
// service.getAll = getAll;
// service.getById = getById;
service.create = validateUser;
// service.update = update;
// service.delete = _delete;

module.exports = service;

// BBDD connection
// mongoose.connection('mongodb://localhost:27017/talketin', (err, res) => {  
//     if (err) throw err
//     console.log('Conexión con la base de datos establecida');

// })

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
        if (err) res.status(500).send({message: 'Error al almacenar el usuario en la base de datos'});

        res.status(200).send({user: userStored});
    });
}

function validateUser(req, res) {
    console.log('Validate user: ', req.body.email);
    let email = req.body.email;

    // validation
    User.findOne(
        { email: email },
        function (err, user) {
            if (err) res.send(400, err.name + ': ' + err.message);

            if (user) {
                // email already exists
                res.send(412, 'Email "' + email + '" is already taken');
            } else {
                this.create(req.body);
            }
        }
    );
}