var mongoose = require('mongoose');

var PinSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true,
  },
  imgLink: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  author: {
    id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});


var Pin = mongoose.model('Pin', PinSchema);
module.exports = Pin;
