//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let Message = require('../models/Message')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')
let should = chai.should()

const getMessage = (text) => new Message({
  participants: ["5a78800f2b225224f01d167a", "5b78800f2b225224f01d167b"],
  messages: {
    sender: '5a78800f2b225224f01d167a',
    text: text
  }
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
          res.body.message.should.have.property('participants')
          res.body.message.should.have.property('messages')
          res.body.message.messages[0].should.have.property('sender')
          res.body.message.messages[0].should.have.property('text')
          done()
        })
    })
  })

  describe('/POST a bad message', () => {
    it('it should NOT CREATE and send a message', (done) => {
      let message = getMessage('')
      chai.request(server)
        .post('/messages/send')
        .send(message)
        .end((err, res) => {
          res.should.have.status(500)
          res.body.should.have.property('information').eql('Error when sending the message to the database')
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
            res.body.should.have.property('messages')
            res.body.messages[0].should.have.property('sender')
            res.body.messages[0].should.have.property('text')
            res.body.should.have.property('_id').eql(message.id)
            done()
          })
      })
    })
  })

  describe('/GET/user/:idUser messages', () => {
    it('it should GET messages by the given idUser', (done) => {
      let userId = "5a78800f2b225224f01d167a"
      let m1 = new Message({
        participants: [userId, "5b78800f2b225224f01d167b"],
        messages: [{
          sender: userId,
          text: "message 1"
        }]
      })
      let m2 = new Message({
        participants: ["5a78800f2b225224f01d167c", userId],
        messages: [{
          sender: "5a78800f2b225224f01d167c",
          text: "message 2"
        }]
      })
      let m3 = new Message({
          participants: ["5a78800f2b225224f01d167d", userId],
          messages: [{
            sender: "5a78800f2b225224f01d167d",
            text: "message 3"
          }]
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
      let newMessage = {
        sender: message.participants[1],
        text: 'New test text.'
      }
      message.save((err, message) => {
        message.messages.push(newMessage)
        let update = message.messages
        chai.request(server)
          .put('/messages/' + message.id)
          .send({
            messages: update
          })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('information').eql('Message to ' + res.body.message.to + ' has been updated')
            res.body.message.messages[1].should.have.property('text').eql('New test text.')
            done()
          })
      })
    })
  })

  describe('/PUT/:id message (NOT FOUND)', () => {
    it('it should NOT UPDATE a message given the id', (done) => {
      chai.request(server)
        .put('/messages/5a7dd492e6571a3e68d430f7')
        .send({text: "text update"})
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('information').eql("Message not found")
          done()
        })
    })
  })

  describe('/PUT/ANSWER/:id message', () => {
    it('it should ANSWER a message given the id', (done) => {
      let message = getMessage('Test text.')
      let newMessage = {
        sender: message.participants[1],
        text: 'New test text.'
      }
      message.save((err, message) => {
        chai.request(server)
          .put('/messages/answer/' + message.id)
          .send(newMessage)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('information').eql('Answer was sent')
            done()
          })
      })
    })
  })

  // TODO
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

  describe('/DELETE/:id message NOT FOUND', () => {
    it('it should fail at DELETE a message given the id', (done) => {
      chai.request(server)
        .delete('/messages/' + '5a7dd492e6571a3e68d430f7')
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('information').eql("Message not found")
          done()
        })
    })
  })

})
