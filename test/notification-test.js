//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let Notification = require('../models/Notification')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')
let should = chai.should()

const getNotification = (type, text) => new Notification({
  user: "5a78800f2b225224f01d167a",
  type: type,
  url: "www.url.com",
  text: text
})

chai.use(chaiHttp)

describe('Notifications', () => {
  beforeEach((done) => { //Before each test we empty the database
    Notification.remove({}, (err) => {
      done()
    })
  })

  describe('/POST a notification', () => {
    it('it should CREATE and send a notification', (done) => {
      let notification = getNotification('message', 'You have received a message.')
      chai.request(server)
        .post('/notifications/send')
        .send(notification)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.information.should.to.be.eql('Notification has been sent')
          res.body.notification.should.have.property('user')
          res.body.notification.should.have.property('type').eql('message')
          res.body.notification.should.have.property('url')
          res.body.notification.should.have.property('text').eql('You have received a message.')
          res.body.notification.should.have.property('visited').eql(false)
          done()
        })
    })
  })

  describe('/POST a bad notification', () => {
    it('it should NOT CREATE and send a notification', (done) => {
      let notification = getNotification('', '')
      chai.request(server)
        .post('/notifications/send')
        .send(notification)
        .end((err, res) => {
          res.should.have.status(500)
          res.body.should.have.property('information').eql('Error when sending the notification to the database')
          done()
        })
    })
  })

  describe('/GET/user/:idUser notifications', () => {
    it('it should GET notifications by the given idUser', (done) => {
      let userId = "5a78800f2b225224f01d167a"
      let n1 = getNotification('message', 'You have received a message.')
      let n2 = getNotification('like', 'You have received a like.')
      let n3 = getNotification('welcome', 'Welcome to MeetYourLingo.')
      n1.save((err, n1) => {
        n2.save((err, n2) => {
          n3.save((err, n3) => {
            chai.request(server)
              .get('/notifications/user/' + userId)
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

  describe('/PUT/:id notification', () => {
    it('it should UPDATE a notification given the id', (done) => {
      let notification = getNotification('message', 'You have received a message.')
      notification.save((err, notification) => {
        chai.request(server)
          .put('/notifications/' + notification.id)
          .send({
            visited: true
          })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('information').eql('Notification has been updated')
            res.body.notification.should.have.property('visited').eql(true)
            done()
          })
      })
    })
  })

  describe('/PUT/changeState/ :id notification', () => {
    it('it should CHANGE the state of a notification given the id', (done) => {
      let notification = getNotification('message', 'You have received a message.')
      notification.save((err, notification) => {
        chai.request(server)
          .put('/notifications/change-state/' + notification.id)
          .send()
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('information').eql('The state of notification has been changed')
            res.body.result.should.have.property('nModified').eql(1)
            done()
          })
      })
    })
  })

  describe('/PUT/:id notification (NOT FOUND)', () => {
    it('it should NOT UPDATE a notification given the id', (done) => {
      chai.request(server)
        .put('/notifications/5a7dd492e6571a3e68d430f7')
        .send({
          visited: true
        })
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('information').eql("Notification not found")
          done()
        })
    })
  })

  // TODO
  describe('/DELETE/:id notification', () => {
    it('it should DELETE a notification given the id', (done) => {
      let notification = getNotification('message', 'You have received a message.')
      notification.save((err, notification) => {
        chai.request(server)
          .delete('/notifications/' + notification.id)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('information').eql('Notification has been deleted')
            done()
          })
      })
    })
  })

  describe('/DELETE/:id notification NOT FOUND', () => {
    it('it should fail at DELETE a notification given the id', (done) => {
      chai.request(server)
        .delete('/notifications/' + '5a7dd492e6571a3e68d430f7')
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('information').eql("Notification not found")
          done()
        })
    })
  })

})
