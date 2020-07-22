const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const User = require('./userModel');

const schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  commentCounts: { type: Number, default: 0 },
  tags: { type: Array },
  createdDate  : { type: Date, default: Date.now },
  recentComments: { type: Array }
}, {
  toJSON: {virtuals: true},
  timestamps: true,
  collection: 'posts'
});
// createdDate: { type: Date, default: Date.now}, 

schema.virtual('comments', {
  ref: 'Comment', //ลิงก์ไปที่โมเดล Comment
  localField: '_id', //_id ฟิลด์ของโมเดล Post (ไฟล์นี้)
  foreignField: 'post' //post ฟิลด์ของโมเดล Comment (fk)
});

const post = mongoose.model('Post', schema);

module.exports = post;