const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const authenticate = require('./authenticate');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const mongoose = require('mongoose');
const connect = mongoose.connect(url, {
	useCreateIndex: true,
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true
});
​
connect.then(() => console.log('Connected correctly to server'), (err) => console.log(err));
const app = express();
​
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
​
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	session({
		name: 'session-id',
		secret: '123789',
		saveUninitialized: false,
		resave: false,
		store: new FileStore()
	})
);
​
app.use(passport.initialize());
app.use(passport.session());
​
app.use('/', indexRouter);
app.use('/users', usersRouter);
​
function auth(req, res, next) {
	console.log(req.user);
​
	if (!req.user) {
		const err = new Error('No authentication!');
		err.status = 401;
		return next(err);
	} else {
		return next();
	}
}
​
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));
​
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
​
app.use(function(req, res, next) {
	next(createError(404));
});
​
app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
​
	res.status(err.status || 500);
	res.render('error');
});
​
module.exports = app;