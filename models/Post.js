var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: {type: String, required: true, trim: true},
  content: {type: String, required: true, trim: true},
  category: {type: String, trim: true},
  gender: {type: String, trim: true},
  age: {type: String, trim: true},
  createdAt: {type: Date, default: Date.now},
  read: {type: Number, default: 0}
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

var Post = mongoose.model('Post', schema);

module.exports = Post;
