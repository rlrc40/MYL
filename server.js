const express = require('express');     
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const port = process.env.NODE_ENV === 'production' ? 80 : 3000;
const url = "mongodb://localhost/talketin";
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use('/users', require('./controllers/users-controller'));


app.listen(port, () => {
    console.log('Server listening on port ' + port);
})
