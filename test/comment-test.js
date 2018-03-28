//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let User = require('../models/User')
let Group = require('../models/Group')
let Comment = require('../models/Comment')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')
let should = chai.should()

const getUser = (email) => new User({
  name: "User",
  email: email,
  description: "blablabla",
  age: 24,
  gender: 'F',
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
  name: "School Group",
  description: 'This group is...',
  avatar: 'avatar.jpg',
  languages: ['English'],
  members: [creator, '5a820605c9af27591458976a']
})

const getComment = (discussion_id, author) => new Comment({
  author: author,
  discussion_id: discussion_id,
  discussion_childs: [],
  bodyText: 'I think that..'
})

chai.use(chaiHttp)

describe('Comments', () => {
    beforeEach((done) => { //Before each test we empty the database
      User.remove({}, (err) => {
        Group.remove({}, (err) => {
  		      Comment.remove({}, (err) => {
  			      done()
    		    })
    	   })
      })
    })

  /*
   * Test the /POST route
   */
  describe('/POST new comment', () => {
    it('it should POST a new comment', (done) => {
	  let user = getUser('test2@email.xom')
    let group = getGroup(user.id)
    let comment = getComment(group.id, user.id)

  	  user.save((err, user) => {
  		  group.save((err, group) => {
  			  chai.request(server)
  				.post('/comments/post')
  				.send(comment)
  				.end((err, res) => {
            res.should.have.status(200)
  				  res.body.should.be.a('object')
            res.body.comment.author.should.be.eql(user.id)
            res.body.comment.discussion_id.should.be.eql(group.id)
  				  done()
  				})
        })
  	  })
    })
  })

  describe('/POST comment with any text', () => {
    it('it shouldn´t POST a comment without text', (done) => {
      let user = getUser('test2@email.xom')
      let group = getGroup(user.id)
      let comment = (discussion_id, author) => new Comment({
        author: author,
        discussion_id: discussion_id,
        discussion_childs: [],
        bodyText: ''
      })

      user.save((err, user) => {
  		  group.save((err, group) => {
  			  chai.request(server)
  				.post('/comments/post')
  				.send(comment(group.id, user.id))
  				.end((err, res) => {
            res.should.have.status(500)
            res.body.message.should.be.eql('Error storing comment in the database: ValidationError: bodyText: No text')
            done()
  				})
        })
  	  })
    })
  })

  describe('/POST a reply', () => {
    it('it should POST a reply if we pass a parentId', (done) => {
	  let user = getUser('test2@email.xom')
    let userWhoReplies = getUser('test3@email.xom')
    let group = getGroup(user.id)
    let comment = getComment(group.id, user.id)
    let reply = (discussion_id, author) => new Comment({
      author: author,
      discussion_id: discussion_id,
      discussion_childs: [],
      bodyText: 'This is a response...'
    })

  	  user.save((err, user) => {
        userWhoReplies.save((err, userWhoReplies) => {
    		  group.save((err, group) => {
            comment.save((err, comment) => {
      			  chai.request(server)
      				.post('/comments/post/' + comment.id)
      				.send(reply(group.id, userWhoReplies.id))
      				.end((err, res) => {
                res.should.have.status(200)
      				  res.body.should.be.a('object')
                res.body.comment.should.have.property('discussion_id').eql(group.id)
                done()
      				})
            })
          })
        })
  	  })
    })
  })

  describe('/PUT comment', () => {
    it('it should UPDATE a comment given a id', (done) => {
      let user = getUser('test2@email.xom')
      let group = getGroup(user.id)
      let comment = getComment(group.id, user.id)

      user.save((err, user) => {
  		  group.save((err, group) => {
          comment.save((err, comment) => {
    			  chai.request(server)
    				.put('/comments/' + comment.id)
    				.send({
              bodyText: 'I´ve edited this comment...'
            })
    				.end((err, res) => {
              res.should.have.status(200)
              done()
    				})
          })
        })
  	  })
    })
  })

  describe('/DELETE comment', () => {
    it('it should DELETE a comment given a id', (done) => {
      let user = getUser('test2@email.xom')
      let group = getGroup(user.id)
      let comment = getComment(group.id, user.id)

      user.save((err, user) => {
  		  group.save((err, group) => {
          comment.save((err, comment) => {
    			  chai.request(server)
    				.delete('/comments/' + comment.id)
    				.end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eql('Comment has been deleted')
              done()
            })
          })
        })
  	  })
    })
  })

  describe('/DELETE non-existent comment', () => {
    it('it should // NOTE:  DELETE a comment if the id does not exist', (done) => {
      let user = getUser('test2@email.xom')
      let group = getGroup(user.id)
      let comment = getComment(group.id, user.id)

      user.save((err, user) => {
  		  group.save((err, group) => {
          comment.save((err, comment) => {
    			  chai.request(server)
    				.delete('/comments/5a820605c9af27591458976a')
    				.end((err, res) => {
                res.should.have.status(404)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eql('Comment not found')
              done()
            })
          })
        })
  	  })
    })
  })

 })
