//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let Group = require('../models/Group')
let User = require('../models/User')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')
let should = chai.should()

const getGroup = (name, creatorId) => new Group({
  creator: creatorId,
	name: name,
	description: 'Description text',
	avatar: 'avatar2.jpg',
	languages: ['English'],
	members: []
})

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
                res.body.should.be.a('object')
              done()
            })
      })
  })

  describe('/POST a group', () => {
      it('it should CREATE a new group', (done) => {
        let user = getUser('userOne@email.com')
        user.save((err, user) => {
          let group = getGroup('Erasmus', user.id)
          chai.request(server)
            .post('/groups/register')
            .send(group)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.message.should.to.be.eql('Group Erasmus has been created')
                res.body.group.should.be.a('object')
                res.body.group.should.have.property('creator').eql(user.id)
                res.body.group.should.have.property('name')
                res.body.group.should.have.property('description')
                res.body.group.should.have.property('avatar')
                res.body.group.should.have.property('languages')
                res.body.group.members.length.should.be.eql(1)
                done()
            })
          })
      })

  })

  describe('/POST group with existing name', () => {
    it('it should NOT CREATE a new group', (done) => {
      let group = getGroup('Madrid')
      group.save((err, group) => {
        chai.request(server)
            .post('/groups/register')
            .send(group)
            .end((err, res) => {
                res.should.have.status(412)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eql('Group name is already taken')
                done()
            })
          })
    })
  })

  describe('/POST group with empty name', () => {
    it('it SHOULD NOT CREATE a new group without name', (done) => {
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
        let group = getGroup('Students')
        group.save((err, group) => {
            chai.request(server)
            .get('/groups/' + group.id)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.group.should.have.property('_id').eql(group.id)
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
                    res.body.should.have.property('message').eql('Group has been updated')
                  done()
                })
          })
      })
  })

  describe('/PUT/:id unexistent group', () => {
      it('it should NOT UPDATE the group given a wrong id', (done) => {
        let group = getGroup('Roma')
        group.save((err, group) => {
                chai.request(server)
                .put('/groups/' + '5574b291b3a882059c328666')
                .send({description: 'New description of the group'})
                .end((err, res) => {
                    res.should.have.status(404)
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('Group not found')
                  done()
                })
          })
      })
  })

  describe('/GET/:userId groups', () => {
    it('it should GET some groups given a user id', (done) => {
      let user = getUser('userOne@email.com')
      user.save((err, user) => {
        let group = getGroup('Students', user.id)
        group.save((err, group) => {
          group.update({
            members: [user.id]
          }, (err, group) => {
            chai.request(server)
                .get('/groups/user/'+ user.id)
                .end((err, res) => {
                  res.should.have.status(200)
                  res.body.should.be.a('object')
                  res.body.groups.length.should.be.eql(1)
                  res.body.groups[0].name.should.be.eql('Students')
                  done()
                })
              })
          })
        })
      })
 })

 describe('/GET groups by name', () => {
    it('it should GET groups given a name', (done) => {
      let searchName = {
        name: 'recip'
      }
      let group = getGroup('Recipes')
      group.save((err, group) => {
        chai.request(server)
          .post('/groups/find/name')
          .send(searchName)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.groups.length.should.be.eql(1)
            res.body.groups[0].name.should.be.eql('Recipes')
            res.body.groups[0]['_id'].should.be.eql(group.id)
            done()
          })
      })
    })
})

describe('/GET groups by search', () => {
   it('it should GET groups given a name', (done) => {
     let searchName = {
       search: 'barcelo'
     }
     let group = getGroup('Barcelona')
     group.save((err, group) => {
       chai.request(server)
         .post('/groups/find')
         .send(searchName)
         .end((err, res) => {
           res.should.have.status(200)
           res.body.should.be.a('object')
           res.body.groups.length.should.be.eql(1)
           res.body.groups[0].name.should.be.eql('Barcelona')
           res.body.groups[0]['_id'].should.be.eql(group.id)
           done()
         })
     })
   })
})


describe('/GET groups by languages', () => {
   it('it should GET groups that match with given languages', (done) => {
      let languages = {
        languages: 'English'
      }
      let group = getGroup('Spain')
      let group2 = getGroup('Paris')
      let group3 = getGroup('Rome')
      group.save((err, group) => {
        group2.save((err, group2) => {
          group3.save((err, group3) => {
            chai.request(server)
              .post('/groups/find')
              .send(languages)
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.groups.length.should.be.eql(3)
                res.body.groups.map((group) => {
                      group['languages'].should.be.eql(['English'])
                })
                done()
              })
		        })
		    })
      })
    })
})

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
      it('it should fail REMOVING a non-existen group', (done) => {
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
