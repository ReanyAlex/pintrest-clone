var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Pin = require("../models/pin");
/* GET home page */
router.get('/', function(req, res) {
  Pin.find({},function(err,pins){
    if (err) {
      console.log(err);
    }else {
      res.render('index', {user: req.user, pins:pins });
    }
  })
});

//show My pins
router.get('/show/:id', function(req, res) {

  User.findById(req.params.id,function(err,user) {
    if (err) {
      console.log(err);
    }else {


    console.log('user', req.params.id);

    let findAuthor = {author:
      {
        id: user._id,
        username: user.name
      }
    }
    console.log('findAuthor', findAuthor);

    Pin.find(findAuthor,function(err,pins){
      if (err) {
        console.log(err);
      }else {
        console.log('pins', pins);
        res.render('show', {user: req.user, pins:pins });
      }
    })
  }
  })
});

//add Pintrest
router.post('/add', function(req, res) {
  console.log('user', req.user);

  let newPin = {
    name: req.body.title,
    imgLink: req.body.image,
    description: req.body.description,
    website: req.body.website,
    author: {
      id: req.user._id,
      username: req.user.name
    }
  }

  Pin.create(newPin, function(err) {
    if (err) {
      console.log(err);
    }
    console.log("created new pin");
  })

  res.redirect('/');
});

//delete
router.delete('/delete/:id',function(req, res) {
  console.log('delete');
  Pin.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/");
    }else {
      res.redirect("/");
    }
  })
})
module.exports = router;
