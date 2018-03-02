//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let User = require('../models/User')
let Group = require('../models/Group')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')
let should = chai.should()

const getUser = (email) => new User({
  name: "Test",
  email: email,
  description: "blablabla",
  age: 24,
  gender: 'M',
  occupation: '',
  password: '',
  nativeLanguage: 'Spanish',
  languagesToLearn: ['English', 'French'],
  facebookAddress: [],
  facebookAvatar: '',
  facebookLikedPages: [],
  facebookGroups: ['Group1', 'Group2'],
  facebookMusic: ['smrtdeath', 'Shakira'],
  facebookMovies: ['RockAndRolla', 'The Beatles'],
  facebookBooks: ['Historias Nórdicas', 'Book'],
  facebookSeries: ['Big Bang Theory', 'Vikings'],
  facebookSports: ['Futbol', 'Skate'],
  facebookFriends: ['Pedro', 'Juan'],
  instagramAccount: 'instagramAccount',
  twitterAccount: 'twitterAccount',
  skype: 'testSkype'
})

const getGroup = (creator) => new Group({
  creator: creator,
  name: "Group name",
  description: 'Description of the group',
  avatar: 'avatar.jpg',
  languages: ['English'],
  members: [creator, '5a820605c9af27591458976a']
})

chai.use(chaiHttp)

describe('Users', () => {
  beforeEach((done) => { //Before each test we empty the database
    User.remove({}, (err) => {
      Group.remove({}, (err) => {
        done()
      })
    })
  })

  /*
   * Test the /POST route
   */
  describe('/POST user', () => {
    it('it should CREATE a new user', (done) => {
      let user = getUser('test2@email.xom')
      chai.request(server)
        .post('/users/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.message.should.to.be.eql('User Test has been created')
          res.body.user.should.be.a('object')
          res.body.user.should.have.property('name')
          res.body.user.should.have.property('email')
          res.body.user.should.have.property('description')
          res.body.user.should.have.property('age')
          done()
        })
    })
  })

  describe('/POST user with existing email', () => {
    it('it should FAIL at CREATE the new user', (done) => {
      var user = getUser('test2@email.xom')
      user.save((err, user) => {
        chai.request(server)
          .post('/users/register')
          .send(user)
          .end((err, res) => {
            res.should.have.status(412)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('Email test2@email.xom is already taken')
            done()
          })
      })
    })
  })

  describe('/POST find users', () => {
    it('it should GET all the users that match by given fields', (done) => {
      let searchBody = {
        nativeLanguage: 'Spanish',
        languagesToLearn: ['English'],
        gender: 'M'
      }
      let user = getUser('test@email.xom')
      let user2 = getUser('test2@mail.xom')
      let user3 = getUser('test3@mail.xom')
      user.save((err, user) => {
        user2.save((err, user) => {
          user3.save((err, user) => {
            chai.request(server)
              .put('/users/' + user.id)
              .send({
                nativeLanguage: 'English',
              })
              .end((err, res) => {
                chai.request(server)
                  .post('/users/find')
                  .send(searchBody)
                  .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(2)
                    res.body.map((user) => {
                      user['nativeLanguage'].should.be.eql('Spanish')
                      user['languagesToLearn'].should.contain('English')
                      user['gender'].should.be.eql('M')
                    })
                    done()
                  })
              })
          })
        })
      })
    })
  })

  describe('/POST find users by name', () => {
    it('it should GET an user by the given name', (done) => {
      let searchName = {
        name: 'Test'
      }
      let user = getUser('test@email.com')
      user.save((err, user) => {
        chai.request(server)
          .post('/users/find/name')
          .send(searchName)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.length.should.be.eql(1)
            res.body[0].should.have.property('name').eql('Test')
            res.body[0].should.have.property('email')
            res.body[0].should.have.property('description')
            res.body[0].should.have.property('age')
            res.body[0].should.have.property('_id').eql(user.id)
            done()
          })
      })
    })
  })

  describe('/POST find users by filter', () => {
    it('it should GET an user by the given some fields', (done) => {
      let filter = {
        facebookGroups: 'Group1',
        facebookMusic: 'smrtdeath',
        facebookMovies: 'The Beatles',
        facebookBooks: 'Historias Nórdicas',
        facebookSeries: 'Big Bang Theory',
        facebookSports: 'Futbol',
        facebookFriends: 'Juan'
      }
      let user = getUser('test@email.xom')
      user.save((err, user) => {
        chai.request(server)
          .post('/users/filter')
          .send(filter)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.length.should.be.eql(1)
            res.body[0].should.have.property('name').eql('Test')
            res.body[0].should.have.property('email')
            res.body[0].should.have.property('description')
            res.body[0].should.have.property('age')
            res.body[0].should.have.property('facebookGroups')
            res.body[0].should.have.property('facebookMusic')
            res.body[0].should.have.property('facebookMovies')
            res.body[0].should.have.property('facebookBooks')
            res.body[0].should.have.property('facebookSeries')
            res.body[0].should.have.property('facebookSports')
            res.body[0].should.have.property('facebookFriends')
            res.body[0].should.have.property('_id').eql(user.id)
            done()
          })
      })
    })
  })

  describe('/POST find users by name NOT FOUND', () => {
    it('it should NOT GET an user by the given name', (done) => {
      let searchName = {
        name: 'TestNotExist'
      }
      let user = getUser('test@email.xom')
      chai.request(server)
        .post('/users/find/name')
        .send(searchName)
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('message').eql('Users not found')
          done()
        })
    })
  })

  /*
   * Test the /GET route
   */
  describe('/GET users', () => {
    it('it should GET all the users', (done) => {
      let user = getUser('test@email.xom')
      chai.request(server)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          done()
          res.body.length.should.be.eql(0)
        })
    })
  })

  /*
   * Test the /GET/:id route
   */
  describe('/GET/:id user', () => {
    it('it should GET a user by the given id', (done) => {
      let user = getUser('test4@email.xom')
      user.save((err, user) => {
        chai.request(server)
          .get('/users/' + user.id)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('name')
            res.body.should.have.property('email')
            res.body.should.have.property('description')
            res.body.should.have.property('age')
            res.body.should.have.property('_id').eql(user.id)
            done()
          })
      })
    })
  })

  describe('/GET/:id user NOT FOUND', () => {
    it('it should NOT GET an user', (done) => {
      let user = getUser('test4@email.xom')
      user.save((err, user) => {
        chai.request(server)
          .get('/users/5a6d935d4b60a06aacada294')
          .end((err, res) => {
            res.should.have.status(404)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('User not found')
            done()
          })
      })
    })
  })

  describe('/GET/:groupId users', () => {
    it('it should GET users by the given id group', (done) => {
      let user = getUser('test4@email.xom')
      user.save((err, user) => {
        user.update({
          groups: ['5a7efd9a94aaa318b4141f5b']
        }, (err, user) => {
          let user2 = getUser('test2@email.xom')
          user2.save((err, user) => {
            user.update({
              groups: ['5a7efd9a94aaa318b4141f5b']
            }, (err, user) => {
              chai.request(server)
                .get('/users/group/5a7efd9a94aaa318b4141f5b')
                .end((err, res) => {
                  res.should.have.status(200)
                  res.body.should.be.a('array')
                  res.body.length.should.be.eql(2)
                  done()
                })
            })
          })
        })
      })
    })
  })

  describe('/GET users connections', () => {
    it('it should GET all the connections given id user', (done) => {
      let user = getUser('test@email.xom')
      let user2 = getUser('test2@email.xom')
      let user3 = getUser('test3@email.xom')
      user.save((err, user) => {
        user2.save((err, user) => {
          user3.save((err, user) => {
            chai.request(server)
              .put('/users/' + user.id)
              .send({
                connections: [user2.id, user3.id]
              })
              .end((err, res) => {
                chai.request(server)
                  .get('/users/connections/' + user.id)
                  .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(2)
                    res.body[0]['_id'].should.be.eql(user2.id)
                    res.body[1]['_id'].should.be.eql(user3.id)
                    done()
                  })
              })
          })
        })
      })
    })
  })

  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id user', () => {
    it('it should UPDATE a user given the id', (done) => {
      let user = getUser('test5@email.xom')
      user.save((err, user) => {
        chai.request(server)
          .put('/users/' + user.id)
          .send({
            email: 'teest5@mail.com'
          })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('message').eql('User ' + user.name + ' has been updated')
            res.body.user.should.have.property('email').eql('teest5@mail.com')
            done()
          })
      })
    })
  })

  describe('/PUT/:id user NOT FOUND', () => {
    it('it should NOT UPDATE the user', (done) => {
      let user = getUser('test5@email.xom')
      chai.request(server)
        .put('/users/5a6d935d4b60a06aacada294')
        .send({
          email: 'teest5@mail.com'
        })
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('message').eql('User not found')
          done()
        })
    })
  })

  describe('/PUT/add-connection/ :id user', () => {
    it('it should ADD new connection by the given user id', (done) => {
      let user = getUser('user@email.xom')
      user.save((err, user) => {
        chai.request(server)
          .put('/users/add-connection/' + user.id)
          .send({
            connectionId: '5a6d935d4b60a06aacada294'
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

  describe('/PUT/remove-connection/ :id user', () => {
    it('it should REMOVE a connection by the given user id', (done) => {
      let user = getUser('user@email.xom')
      user.save((err, user) => {
        chai.request(server)
          .put('/users/' + user.id)
          .send({
            connections: ['5a6d935d4b60a06aacada294', '5a6d935d4b60a06aacada293']
          })
          .end((err, res) => {
            chai.request(server)
              .put('/users/remove-connection/' + user.id)
              .send({
                connectionId: '5a6d935d4b60a06aacada294'
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


  // TODO
  describe('/DELETE/:id user', () => {
    it('it should DELETE a user given the id', (done) => {
      let user = getUser('test6@mail.xom')
      let group = getGroup(user.id);
      user.groups = [group.id]
      group.save((err, group) => {
        user.save((err, user) => {
          chai.request(server)
            .delete('/users/' + user.id)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('message').eql('User has been deleted')
              done()
            })
        })
      })
    })
  })

  /*
   * Test the /DELETE/:id route
   */
  // TODO
  describe('/DELETE/:id user NOT FOUND', () => {
    it('it should NOT DELETE a user given the id', (done) => {
      let user = getUser('test6@mail.xom')
      chai.request(server)
        .delete('/users/5a6d935d4b60a06aacada294')
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('message').eql('Error at deleting user: 5a6d935d4b60a06aacada294 not found')
          done()
        })
    })
  })

})
