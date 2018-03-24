//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let Event = require('../models/Event')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')
let should = chai.should()

const getEvent = (text, followers) => new Event({
  creator: "5a7dd8d589fd5e44a868946a",
  avatar: "avatar.png",
  title: text,
  description: "Esta es una pequeña descripción acerca del evento.",
  followers: followers,
  tags: "Meeting",
  locate: {
    coord: "123"
  },
  date: new Date("October 13, 2014 11:13:00"),
  languages: "Spanish"
})

chai.use(chaiHttp)

describe('Events', () => {
  beforeEach((done) => { //Before each test we empty the database
    Event.remove({}, (err) => {
      done()
    })
  })

  describe('/POST an event', () => {
    it('it should CREATE an event', (done) => {
      let event = getEvent('Title event', ["5a7dd8d589fd5e44a868946a", "5a7dd8d589fd5e44a868946b"])
      chai.request(server)
        .post('/events/create')
        .send(event)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.message.should.to.be.eql('Event has been created')
          res.body.event.should.have.property('creator')
          res.body.event.should.have.property('avatar')
          res.body.event.should.have.property('title')
          res.body.event.should.have.property('description')
          res.body.event.should.have.property('locate')
          res.body.event.should.have.property('date')
          res.body.event.should.have.property('languages')
          res.body.event.should.have.property('followers')
          res.body.event.should.have.property('tags')
          done()
        })
    })
  })

  describe('/POST a bad event', () => {
    it('it should NOT CREATE and send a event', (done) => {
      let event = getEvent('')
      chai.request(server)
        .post('/events/create')
        .send(event)
        .end((err, res) => {
          res.should.have.status(500)
          res.body.should.have.property('message').eql('Events validation failed: title: title is required')
          done()
        })
    })
  })

  describe('/POST find events by name', () => {
    it('it should GET the events by the given name', (done) => {
      let searchNameTitle = {
        title: 'le ev'
      }
      let event = getEvent('Title event', ["5a7dd8d589fd5e44a868946a", "5a7dd8d589fd5e44a868946b"])
      event.save((err, user) => {
        chai.request(server)
          .post('/events/find/title')
          .send(searchNameTitle)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.length.should.be.eql(1)
            res.body[0].should.have.property('creator')
            res.body[0].should.have.property('avatar')
            res.body[0].should.have.property('title').eql('Title event')
            res.body[0].should.have.property('description')
            res.body[0].should.have.property('locate')
            res.body[0].should.have.property('date')
            res.body[0].should.have.property('languages')
            res.body[0].should.have.property('followers')
            res.body[0].should.have.property('tags')
            res.body[0].should.have.property('_id').eql(event.id)
            done()
          })
      })
    })
  })

  describe('/POST find events by filter', () => {
    it('it should GET events by the given some fields', (done) => {
      let filter = {
        languages: 'Spanish',
        tags: 'Meeting',
        date: new Date("October 13, 2014 11:13:00")
      }
      let event = getEvent('Title event', ["5a7dd8d589fd5e44a868946a", "5a7dd8d589fd5e44a868946b"])
      event.save((err, user) => {
        chai.request(server)
          .post('/events/filter')
          .send(filter)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.length.should.be.eql(1)
            res.body[0].should.have.property('title').eql('Title event')
            res.body[0].should.have.property('languages')
            res.body[0].should.have.property('tags')
            res.body[0].should.have.property('date')
            res.body[0].should.have.property('_id').eql(event.id)
            done()
          })
      })
    })
  })



  describe('/POST find events by general search', () => {
    it('it should GET events by the givenkeyword', (done) => {
      let keyword = {
        'keyword': 'eeting'
      }
      let event = getEvent('Title event', ["5a7dd8d589fd5e44a868946a", "5a7dd8d589fd5e44a868946b"])
      event.save((err, user) => {
        chai.request(server)
          .post('/events/find')
          .send(keyword)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.length.should.be.eql(1)
            res.body[0].should.have.property('title').eql('Title event')
            res.body[0].should.have.property('languages')
            res.body[0].should.have.property('tags')
            res.body[0].should.have.property('locate')
            res.body[0].should.have.property('_id').eql(event.id)
            done()
          })
      })
    })
  })

  describe('/GET/:id event', () => {
    it('it should GET a event by the given id', (done) => {
      let event = getEvent('Title event', ["5a7dd8d589fd5e44a868946a", "5a7dd8d589fd5e44a868946b"])
      event.save((err, event) => {
        chai.request(server)
          .get('/events/' + event.id)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('creator')
            res.body.should.have.property('avatar')
            res.body.should.have.property('title')
            res.body.should.have.property('description')
            res.body.should.have.property('locate')
            res.body.should.have.property('date')
            res.body.should.have.property('languages')
            res.body.should.have.property('followers')
            res.body.should.have.property('tags')
            res.body.should.have.property('_id').eql(event.id)
            done()
          })
      })
    })
  })

  describe('/GET/user/:idUser events', () => {
    it('it should GET events by the given idUser', (done) => {
      let userId = "5a7dd8d589fd5e44a868946a"
      let e1 = getEvent('Title event', ["5a7dd8d589fd5e44a868946a", "5a7dd8d589fd5e44a868946b"])
      let e2 = getEvent('Title event 2', ["5a7dd8d589fd5e44a868946c", "5a7dd8d589fd5e44a868946b"])
      let e3 = getEvent('Title event 3', ["5a7dd8d589fd5e44a868946a", "5a7dd8d589fd5e44a868946c"])

      e1.save((err, e1) => {
        e2.save((err, e2) => {
          e3.save((err, e3) => {
            chai.request(server)
              .get('/events/user/' + userId)
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body.should.have.length(2)
                done()
              })
          })
        })
      })
    })
  })

  describe('/PUT/:id event', () => {
    it('it should UPDATE a event given the id', (done) => {
      let event = getEvent('Test text.')
      event.save((err, event) => {
        chai.request(server)
          .put('/events/' + event.id)
          .send({
            avatar: "newLogo.png",
            title: "newTitle",
            locate: {
              coor: "456"
            },
            description: "This is the new short description",
            tags: ["Meeting", "Party"],
            languages: ["English", "Spanish"]
          })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('Event has been updated')
            res.body.event.should.have.property('avatar').eql('newLogo.png')
            res.body.event.should.have.property('title').eql('newTitle')
            res.body.event.should.have.property('locate').eql({
              coor: "456"
            })
            res.body.event.should.have.property('description').eql('This is the new short description')
            res.body.event.should.have.property('languages').eql(["English", "Spanish"])
            res.body.event.should.have.property('tags').eql(["Meeting", "Party"])
            done()
          })
      })
    })
  })

  describe('/PUT/:id event (NOT FOUND)', () => {
    it('it should NOT UPDATE a event given the id', (done) => {
      chai.request(server)
        .put('/events/5a7dd492e6571a3e68d430f7')
        .send({
          text: "text update"
        })
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('message').eql("Event not found")
          done()
        })
    })
  })

  describe('/PUT/add-follower/ :id user', () => {
    it('it should ADD new follower by the given user id', (done) => {
      let event = getEvent('Test text.')
      event.save((err, user) => {
        chai.request(server)
          .put('/events/add-follower/' + event.id)
          .send({
            followerId: '5a6d935d4b60a06aacada294'
          })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('The User has been added')
            res.body.result.should.have.property('nModified').eql(1)
            done()
          })
      })
    })
  })

  describe('/PUT/remove-follower/ :id user', () => {
    it('it should REMOVE a follower by the given user id', (done) => {
      let event = getEvent('Test text.')
      event.save((err, user) => {
        chai.request(server)
          .put('/events/' + event.id)
          .send({
            followers: ['5a6d935d4b60a06aacada294', '5a6d935d4b60a06aacada293']
          })
          .end((err, res) => {
            chai.request(server)
              .put('/events/remove-follower/' + event.id)
              .send({
                followerId: '5a6d935d4b60a06aacada294'
              })
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eql('The User has been removed')
                res.body.result.should.have.property('nModified').eql(1)
                done()
              })
          })
      })
    })
  })

  describe('/DELETE/:id event', () => {
    it('it should DELETE a event given the id', (done) => {
      let event = getEvent('Test text.')
      event.save((err, event) => {
        chai.request(server)
          .delete('/events/' + event.id)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('Event has been deleted')
            done()
          })
      })
    })
  })

  describe('/DELETE/:id event NOT FOUND', () => {
    it('it should fail at DELETE a event given the id', (done) => {
      chai.request(server)
        .delete('/events/' + '5a7dd492e6571a3e68d430f7')
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('message').eql("Event not found")
          done()
        })
    })
  })

})
