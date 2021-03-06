const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const mongoose = require('mongoose');

//load user model
require('../Models/User');
const User = mongoose.model('users');

//User login route
router.get('/login', (req, res) => {
	res.render('users/login');
});

//User register route
router.get('/register', (req, res) => {
	res.render('users/register');
});

//Login form POST
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/ideas',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});


//Register form PoST

router.post('/register', (req, res) => {
	let errors = [];

	if (req.body.password != req.body.password2) {
		errors.push({ text: 'Password do not match' });
	}
	if (req.body.password.length < 4) {
		errors.push({ text: 'Password must be at least 4 characters' });
	}
	if (errors.length > 0) {
		res.render('users/register', {
			errors: errors,
			name: req.name,
			email: req.email,
			password: req.password,
			password2: req.password2
		});
	} else {
		User.findOne({ email: req.body.email }).then(user => {
			if (user) {
				req.flash('error_msg', 'Email already registered');
				res.redirect('/users/register');
			}
			else {
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password
				});

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser.save()
							.then(user => {
								req.flash('success_msg', 'You are now registered and can log in');
								res.redirect('/users/login');
							})
							.catch(err => {
								console.log(err);
							});
					});
				});
			}
		});
	}
});

//logout user
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg','You are logged out');
	res.redirect('/users/login');
});



module.exports = router;