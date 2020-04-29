var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser')
var session = require("express-session");
var okta = require("@okta/okta-sdk-nodejs");
var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;

var indexRouter = require('./routes/index');
var addRouter = require('./routes/add');
var editRouter = require('./routes/edit');
var deleteRouter = require('./routes/delete');
var clearRouter = require('./routes/clear');
var usersRouter = require('./routes/users');

var app = express();

var oktaClient = new okta.Client({
  orgUrl: 'https://dev-852732.okta.com',
  token: '00sSElB-Vaq91-X73dPSXb1YfHVPBpFT5GWN5Asj00'
});
const oidc = new ExpressOIDC({
  issuer: "https://dev-852732.okta.com/oauth2/default",
  client_id: '0oaakc4dplGubPV1s4x6',
  client_secret: 'b1QvklDfr7CuIbIgs3Yb0FNGVd5X8Iqiq8tvZNI6',
  redirect_uri: 'http://simdrive.asuscomm.com:3000/users/callback',
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    callback: {
      path: "/users/callback",
      defaultRedirect: "/"
    }
  }
});

// view engine setup
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./public'));

app.use(session({
  secret: 'jFJhJsh7hSfh78h78t6bg6b67bJJYNdfjFg896Fedrc5fdl',
  resave: true,
  saveUninitialized: false
}));
app.use(oidc.router);
app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }
  oktaClient.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    }).catch(err => {
      next(err);
    });
});
function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }

  next();
}

app.use('/', loginRequired ,indexRouter);
app.use('/add', loginRequired, addRouter);
app.use('/edit', loginRequired, editRouter);
app.use('/delete', loginRequired, deleteRouter);
app.use('/clear', loginRequired, clearRouter);
app.use('/users', loginRequired, usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
