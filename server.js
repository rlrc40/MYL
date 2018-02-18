'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const api = require('./routes')
const hbs = require('express-handlebars')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.engine('.hbs', hbs({
  defaultLayault: 'default',
  ext: '.hbs'
}))

app.set('view engine', '.hbs')

app.use('/', api)
app.get('/login', (req, res) => {
  res.render('login')
})

module.exports = app
