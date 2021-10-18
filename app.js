const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose'); // Import mongoose
const session = require('express-session'); // Import express session
const flash = require('connect-flash');
const methodOvveride = require('method-override');

// Mongoose connection
mongoose.connect('mongodb://localhost:27017/db_mern20', {
    useNewUrlParser: true,
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// admin router 
const adminRouter = require('./routes/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOvveride('_method'));
// Using express session
app.use(session({
    secret: 'Secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}));
app.use(flash()); // Using connect-flash
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/sb-admin-2', express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2')));
// Use admin routes
app.use('/admin', adminRouter);

app.use('/', indexRouter);
app.use('/users', usersRouter);

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