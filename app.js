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

//CORSA middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}


// set view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
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
    cookie: {maxAge: 2 * 60 * 60 * 1000} // 2 hour
}));


app.use(express.static(path.join(__dirname, 'dist')));
app.use('/', index);
app.use('/api', api);
app.use('/auth', require('./routes/auth'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    console.log(err.message);
    if (err.message.startsWith('ORA-20103: Дальнейшая работа в Системе невозможна')) {
        console.log('Session Expired');
        req.session.destroy();
        res.sendStatus(401);
    } else {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.send(err.message);
    }
});

module.exports = app;
