const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: 200
    },
    content: {
      type: String,
      required: [true, 'Please provide content']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'username email'
  });
  next();
});

module.exports = mongoose.model('Post', postSchema);
