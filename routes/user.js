// import express from 'express';
const express = require('express');
const userHelper = require('../helpers/userHelper');
const isAuth = require('../middlewares/isAuth.js');
const isLog = require('../middlewares/isLog');
const router = express.Router();
const passport = require('passport')
require('../middlewares/passport-google');

//setting the root route and giving response,the root route is set as user home page
router.get('/',isAuth,(req, res) => {
    /*
    Cache-Control - controls the caching behaviour in the browser
    Private - the response is intended for a single user and should not be shared(in proxy servers)
    no-cache - it allow to store cache but it revalidate the cache with the server before using a cached version
    no-store - it prevent from storing cache
    must-revalidate - it makes the cliet to revalidate cache on every server request 
    */
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('user/index');
});

//user signup route
router.get('/signup',isLog, (req, res) => {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.render('user/signup');
});

//post signup route for form submition
router.post('/signup', (req, res) => {
    /* function for inserting data into database passing form data as parameter,
    promise returning inserted data and err */
    userHelper.doSignup(req.body).then((resp, err) => {
        if (resp) {
            req.session.user = resp.name;
            res.redirect('/');
        } else {
            res.redirect('/signup');
        }
    });
});

//user login route
router.get('/login',isLog, (req, res) => {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.render('login');
});

//post login route for login form submition
router.post('/login',(req, res) => {
    userHelper.doLogin(req.body).then((resp) => {
        if(resp.admin){
            req.session.user = resp.name;
            req.session.admin = resp.admin;
            res.redirect('/admin');
        }else{
            if (resp.status) {
                req.session.user = resp.name;
                res.redirect('/');
            } else {
                res.redirect('/login');
            }
        }
    });
});

router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/login');
        }
    });
});

router.get('/google',passport.authenticate('google',{ scope: ['email', 'profile'] }));

router.get('/google/callback',passport.authenticate('google',{
    successRedirect: '/',
    failureRedirect: '/google/failure'
}));


module.exports = router;