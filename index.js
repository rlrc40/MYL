'use strict'

const express = require('express')
const mongoose = require('mongoose')
const app = require('./server')
const config = require('./config.js')

const db = mongoose.connect(config.db, (err, res) => {
  if (err) {
    return console.log("Error al conectar con la base de datos")
  }
  console.log('Conexión con la base de datos establecida')
})

app.listen(config.port, () => {
    console.log('Server listening on port ' + config.port)
})

module.exports = app
