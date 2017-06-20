var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);

var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');


var app = express();

//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(allowCrossDomain);

app.use(session({
    store: new SQLiteStore,
    secret: 'papuaz',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 24 * 60 * 60 * 1000} // 1 day
}));


//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(function (req, res, next) {
    console.log(req.sessionID);
    if (!req.session.isLogged) {
        var user = "GUEST",
            pass = "guest";
        require("./db/database").login(
            {
                username: user,
                password: pass,
                sessionID: req.sessionID,
                session: req.session
            }
        )
            .then( function() {
                next();
            })
            .catch(function (error) {
                req.session.isLogged = false;
                //res.sendStatus(500);
                next(error);
            });
    } else next();
});


app.use('/', index);
app.use('/api', api);
//app.use('/getmenu', menu);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
