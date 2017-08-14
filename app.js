var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var passport = require('passport');
var methodOverride  = require('method-override');
var TwitterStrategy = require('passport-twitter').Strategy;

var MongoStore = require('connect-mongo')(session);
var User = require("./models/user");

function generateOrFindUser(accessToken, refreshToken, profile, done){
	console.log(profile);
	if (profile.displayName) {
		User.findOneAndUpdate({
			name: profile.displayName
		}, {
			name: profile.displayName || profile.username,
			photo: profile.photos[0].value,
		}, {
			upsert: true,
		},
		done
		);
	} else {
		var noEmailError = new Error("Your email privacy setting prevent you from sigining in to Bookworm!");
		done(noEmailError, null);
	}
}


//Configure Twitter Strategy
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "http://localhost:3000/auth/twitter/return"
}, generateOrFindUser));

//==========================================
passport.serializeUser(function(user, done){
	done(null, user._id);
});

passport.deserializeUser(function(userId, done){
	User.findById(userId, done);
});

var routes = require('./routes/index');
var auth = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"))
// mongodb connection
mongoose.connect("mongodb://localhost:27017/pintrest");
var db = mongoose.connection;

// Session Configuration for Passport and MongoDB
var sessionOptions = {
	secret: "this is a super secret dadada",
	resave: true,
	saveUninitialized: true,
  	store: new MongoStore({
  	  mongooseConnection: db
 	})
};

app.use(session(sessionOptions));

//Initialize Passport.js
app.use(passport.initialize());

//Restore session
app.use(passport.session());

// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

app.use('/', routes);
app.use('/auth', auth);


app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log('Pintrest clone is running!')
});

module.exports = app;
