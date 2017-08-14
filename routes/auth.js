var express = require('express');
var router = express.Router();
var passport = require('passport');

//twitter
router.get('/login/twitter',
  passport.authenticate('twitter', {scope: ["email"]}));

router.get('/twitter/return',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect to the profile page.
    res.redirect('/');
});

//=====================================
//GET /auth/logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


module.exports = router;
