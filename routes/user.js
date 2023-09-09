// import express from 'express';
const express = require('express');
const userHelper = require('../helpers/userHelper');
const isAuth = require('../middlewares/isAuth.js');
const isLog = require('../middlewares/isLog');
const router = express.Router();
const passport = require('passport')
require('../middlewares/passport-google');
require('../middlewares/passport-facebook')
const signupValidate = require('../middlewares/signupValidator');
const { validationResult } = require('express-validator');
const categoryData = require('../data/category');
const bagProducts = require('../data/bagProducts');
const shoeProducts = require('../data/shoeProducts');


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
    let  userName = req.session.user;
    res.render('user/index' ,{ shoeProducts,bagProducts,categoryData, userName });
});

//user signup route
router.get('/signup',isLog, (req, res) => {

        let error = req.session.errors;
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.render('user/signup',{ error });
});

//post signup route for form submition
router.post('/signup',signupValidate, (req, res) => {
    const err = validationResult(req);
    if(err.msg){
        req.session.errors = err.array();
        res.redirect('/signup');
    }else{
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
    }
});

//user login route
router.get('/login',isLog, (req, res) => {
    //if there is an error in login logErr will be true
    let logErr = req.session.loginErr;
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('login',{ logErr });
});

//post login route for login form submition
router.post('/login',(req, res) => {
    userHelper.doLogin(req.body).then((resp) => {
        //if user is admin set session user to user name and also admin to true,then redirect to admin dashborad
        if(resp.admin){
            req.session.user = resp.name;
            req.session.admin = true;
            res.redirect('/admin');
        }else{
        //if user is a normal user set session user to user name ,then redirect to user home page
            if (resp.status) {
                req.session.name = resp.name;
                res.redirect('/');
            } else {
                //if there is an error in login loginErr will be true and redirect to login page
                req.session.loginErr = true;
                res.redirect('/login');
            }
        }
    });
});

//logout route
router.get('/logout',(req,res)=>{
    //destroying the session and redirecting to login page
    req.session.destroy((err)=>{
        if(err){
            res.redirect('not-found')
        }else{
            res.redirect('/login');
        }
    });
});


//google authentication route
router.get('/google',passport.authenticate('google',{ scope: ['email', 'profile'] }));

//google authentication callback route
router.get('/google/callback',passport.authenticate('google',{
    //if success redirect to 404 page 
    failureRedirect: '/not-found'
}),(req,res)=>{
    req.session.user = req.user.displayName;
    res.redirect('/');
});

//facebook authentication route
router.get('/facebook',passport.authenticate('facebook',{ scope: [ 'public_profile','email'] }));

//facebook authentication callback route
router.get('/facebook/callback',passport.authenticate('facebook',{
    //if success redirect to home page 
    //if success redirect to 404 page 
    failureRedirect: '/not-found'
}),(req,res)=>{
    req.session.user = req.user.displayName;
    res.redirect('/');
}
);


//Not found page
router.get('/not-found',(req,res)=>{
    let admin = req.session.admin;
    res.render('not-found',{ admin });
})

module.exports = router;