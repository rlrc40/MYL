const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const slug = require('mongoose-slug-generator')
const options = { truncate: 6 }

mongoose.plugin(slug, options)


const CommentSchema = new mongoose.Schema({
	author: {
		type: ObjectId,
		required: 'Required author'
  },
  discussion_id: {
    type: ObjectId,
    required: 'Required id'
  },
	discussion_childs: {
    type: Array,
  },
  slug: {
    type: String,
		slug: "author",
  },
  bodyText: {
    type: String,
		max: 200,
		required: 'No text'
  },
  created_at: {
		type: Date, default: Date.now
	}
})

module.exports = mongoose.model('Comment', CommentSchema)
