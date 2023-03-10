const express = require('express');
const app = express()
const todoRouter = require('./controllers/user_processes')
const { pool } = require('./config/pg-config');
const cors = require('cors')
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('express-flash');

app.use(express.static('build'));

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false,
	store: new (require('connect-pg-simple')(session))({
		pool: pool,
		tableName: 'session'
	}),
	cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(express.json());

app.use(cors());

app.use('/api/v1', todoRouter);

app.get('/', (req, res) => {
	console.log(req.user);
	res.send('Welcome to To-do list');
})

module.exports = app;
