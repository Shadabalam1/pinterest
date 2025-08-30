const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
    trim: true
  },
  image:{
    type: String, // URL or path to the image
    required: true
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt:{
    type: Date,
    default: Date.now
  },
  likes: {
    type: Array, // array of user IDs who liked the post
    default: []
   
  },
}); 

module.exports = mongoose.model('Post', postSchema);


