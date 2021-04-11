var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser')
var session = require("express-session");
var flash = require("express-flash");
var methodOverride = require('method-override');

var passport = require('passport');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var users;

var initializePassport = require('./passport-config');
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
);

var indexRouter = require('./routes/index');
var addRouter = require('./routes/add');
var editRouter = require('./routes/edit');
var deleteRouter = require('./routes/delete');
var clearRouter = require('./routes/clear');
var searchRouter = require('./routes/search');
var changeProfilePicRouter = require('./routes/changeProfilePic');
var editUserRouter = require('./routes/editUser');
var likeRouter = require('./routes/like');
var followRouter = require('./routes/follow');
var registrationRouter = require('./routes/register');
var userRouter = require('./routes/user');
var commentRouter = require('./routes/comment');
var profileRouter = require('./routes/profile');
var followersListRouter = require('./routes/followersList');
var followingListRouter = require('./routes/followingList');
var likesListRouter = require('./routes/likesList');
var commentsListRouter = require('./routes/commentsList');


var app = express();

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'jFJhJsh7hSfh78h78t6bg6b67bJJYNdfjFg896Fedrc5fdl',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// view engine setup
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());

app.use(bodyParser.json());

app.use('/register', checkNotAuthenticated, registrationRouter);

app.get('/login', checkNotAuthenticated, function (request, response) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Users");
    dbo.collection("credentials").find({}).toArray(function (err, usersArray) {
      if (err) throw err;
      users = usersArray;
      db.close();
    });
  });
  response.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

app.use('/changeProfilePic', checkAuthenticated, changeProfilePicRouter);
app.use('/editUser', checkAuthenticated, editUserRouter);
app.use('/', checkAuthenticated, indexRouter);
app.use('/add', checkAuthenticated, addRouter);
app.use('/edit', checkAuthenticated, editRouter);
app.use('/delete', checkAuthenticated, deleteRouter);
app.use('/clear', checkAuthenticated, clearRouter);
app.use('/search', checkAuthenticated, searchRouter);
app.use('/like', checkAuthenticated, likeRouter);
app.use('/follow', checkAuthenticated, followRouter);
app.use('/user', checkAuthenticated, userRouter);
app.use('/comment', checkAuthenticated, commentRouter);
app.use('/profile', checkAuthenticated, profileRouter);

app.use('/followersList', checkAuthenticated, followersListRouter);
app.use('/followingList', checkAuthenticated, followingListRouter);
app.use('/likesList', checkAuthenticated, likesListRouter);
app.use('/commentsList', checkAuthenticated, commentsListRouter);


app.use((req, res, next) => {
  next();
  res.locals.user = req.user;
  next();
});

app.use(function (req, res, next) {
  if (req.query._method == 'DELETE') {
    req.method = 'DELETE';
  }
  next();
});

app.delete('/logout', (reqest, response) => {
  reqest.logOut();
  response.redirect('/login');
});

function checkAuthenticated(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect('/login');
}

function checkNotAuthenticated(request, response, next) {
  if (request.isAuthenticated()) {
    return response.redirect('/');
  }
  return next();
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;