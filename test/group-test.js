//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let mongoose = require("mongoose")
let Group = require('../models/Group')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

const getGroup = (name) => new Group({
  creator: '5a74b291b3a882059c328880',
	name: name,
	description: 'Description of the group',
	avatar: 'avatar.jpg',
	languages: ['English'],
	members: []
})

chai.use(chaiHttp)

describe('Groups', () => {
  beforeEach((done) => { //Before each test we empty the database
      Group.remove({}, (err) => {
         done()
      })
  })

  describe('/GET all groups', () => {
      it('it should GET all groups', (done) => {
        chai.request(server)
            .get('/groups')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
              done()
            })
      })
  })

  describe('/POST a group', () => {
      it('it should CREATE a new group', (done) => {
        let group = getGroup('Erasmus')
        chai.request(server)
            .post('/groups/register')
            .send(group)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.message.should.to.be.eql('Group Erasmus has been created')
                res.body.group.should.be.a('object')
                res.body.group.should.have.property('creator')
                res.body.group.should.have.property('name')
                res.body.group.should.have.property('description')
                res.body.group.should.have.property('avatar')
                res.body.group.should.have.property('languages')
                res.body.group.should.have.property('comments')
                res.body.group.should.have.property('members')
              done()
            })
      })
  })

  describe('/POST group with existing name', () => {
    it('it should FAIL at CREATE the new group', (done) => {
      let group = getGroup('Madrid')
      group.save((err, group) => {
        chai.request(server)
            .post('/groups/register')
            .send(group)
            .end((err, res) => {
                res.should.have.status(412)
                res.body.should.be.a('object')
                res.body.message.should.to.be.eql('Group name ' + group.name + ' is already taken')
              done()
            })
          })
    })
  })

  describe('/POST group with empty name', () => {
    it('it SHOULD NOT CREATE the new group with no name', (done) => {
      let group = getGroup()
        chai.request(server)
            .post('/groups/register')
            .send(group)
            .end((err, res) => {
                res.should.have.status(500)
                res.body.should.be.a('object')
                res.body.message.should.to.be.eql('Error when saving the group in the database')
              done()
            })

    })
  })

  describe('/GET/:id group', () => {
      it('it should GET a group by the given id', (done) => {
        let group = getGroup('Berlin')
        group.save((err, group) => {
            chai.request(server)
            .get('/groups/' + group.id)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('creator')
                res.body.should.have.property('name')
                res.body.should.have.property('members')
                res.body.should.have.property('_id').eql(group.id)
              done()
            })
        })

      })
  })

  describe('/PUT/:id group', () => {
      it('it should UPDATE a group given the id', (done) => {
        let group = getGroup('Paris')
        group.save((err, group) => {
                chai.request(server)
                .put('/groups/' + group.id)
                .send({description: 'New description of the group'})
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('Group ' + group.name + ' has been updated')
                    res.body.group.should.have.property('description').eql('New description of the group')
                  done()
                })
          })
      })
  })

  //update no group

  describe('/DELETE/:id group', () => {
      it('it should DELETE a group given the id', (done) => {
        let group = getGroup('Sweden')
        group.save((err, group) => {
                chai.request(server)
                .delete('/groups/' + group.id)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('Group has been deleted')
                  done()
                })
          })
      })
  })

  describe('/DELETE/:id group not found', () => {
      it('it should fail at DELETE a group given the id; the group doesn´t exist', (done) => {
        let group = getGroup('Italy')
        group.save((err, group) => {
                chai.request(server)
                .delete('/groups/5a74b291b3a882059c329992')
                .end((err, res) => {
                    res.should.have.status(404)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('Error deleting group: 5a74b291b3a882059c329992 not found')
                  done()
                })
          })
      })
  })

})
