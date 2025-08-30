const mongoose = require('mongoose');
const passport = require('passport');
const plm = require('passport-local-mongoose');


 mongoose.connect('mongodb://127.0.0.1:27017/pinterest');

 
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // ensures no duplicate usernames
    trim: true
  },
  password: {
    type: String,
   
  },
  posts:  [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'}]
  ,
  dp: {
    type: String, // URL or path to display picture
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  fullname: {
    type: String,
    required: true,
    
  }
}); 

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);


