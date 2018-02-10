//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let mongoose = require("mongoose")
let Message = require('../models/Message')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

const getMessage = (text) => new Message({
  from: "5a78800f2b225224f01d167a",
  to: "5b78800f2b225224f01d167b",
  text: text
})

chai.use(chaiHttp)

describe('Messages', () => {
  beforeEach((done) => { //Before each test we empty the database
    Message.remove({}, (err) => {
      done()
    })
  })

  describe('/POST a message', () => {
    it('it should CREATE and send a message', (done) => {
      let message = getMessage('Test text.')
      chai.request(server)
        .post('/messages/send')
        .send(message)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.information.should.to.be.eql('Message has been sent')
          res.body.message.should.have.property('to')
          res.body.message.should.have.property('from')
          res.body.message.should.have.property('text')
          res.body.message.should.have.property('answers')
          done()
        })
    })
  })

  describe('/GET/:id message', () => {
    it('it should GET a message by the given id', (done) => {
      let message = getMessage('Test text.')
      message.save((err, message) => {
        chai.request(server)
          .get('/messages/' + message.id)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('to')
            res.body.should.have.property('from')
            res.body.should.have.property('text')
            res.body.should.have.property('answers')
            res.body.should.have.property('_id').eql(message.id)
            done()
          })
      })
    })
  })

  describe('/GET/:idUser messages', () => {
    it('it should GET messages by the given idUser', (done) => {
      let userId = "5a78800f2b225224f01d167a"
      let m1 = new Message({
        from: userId,
        to: "5b78800f2b225224f01d167b",
        text: "message 1"
      })
      let m2 = new Message({
        from: "5a78800f2b225224f01d167c",
        to: userId,
        text: "message 2"
      })
      let m3 = new Message({
        from: "5a78800f2b225224f01d167d",
        to: userId,
        text: "message 3"
      })
      m1.save((err, m1) => {
        m2.save((err, m2) => {
          m3.save((err, m3) => {
            chai.request(server)
              .get('/messages/user/' + userId)
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body.should.have.length(3)
                done()
              })
          })
        })
      })
    })
  })

  describe('/PUT/:id message', () => {
    it('it should UPDATE a message given the id', (done) => {
      let message = getMessage('Test text.')
      message.save((err, message) => {
        chai.request(server)
          .put('/messages/' + message.id)
          .send({
            text: 'New test text.'
          })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('information').eql('Message to ' + res.body.message.to + ' has been updated')
            res.body.message.should.have.property('text').eql('New test text.')
            done()
          })
      })
    })
  })

  describe('/PUT/:id message (NOT FOUND)', () => {
    it('it should NOT UPDATE a message given the id', (done) => {
      chai.request(server)
        .put('/messages/5b78800f2a225224f01il11b')
        .send({text: "text update"})
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('information').eql("Error updating message: 5b78800f2a225224f01il11b not found")
          done()
        })
    })
  })

  describe('/DELETE/:id message', () => {
    it('it should DELETE a message given the id', (done) => {
      let message = getMessage('Test text.')
      message.save((err, message) => {
        chai.request(server)
          .delete('/messages/' + message.id)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('information').eql('Message has been deleted')
            done()
          })
      })
    })
  })

  describe('/DELETE/:id unexistent message', () => {
    it('it should fail at DELETE a message given the id', (done) => {
      chai.request(server)
        .delete('/messages/' + '5b78800f2a225224f01il11b')
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('information').eql("Error deleting message: 5b78800f2a225224f01il11b not found")
          done()
        })
    })
  })

})
