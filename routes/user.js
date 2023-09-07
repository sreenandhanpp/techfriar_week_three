// import express from 'express';
// import  {userHelper} from '../helpers/userHelper.js';
const express = require('express');
const userHelper = require('../helpers/userHelper');
const router = express.Router();


//setting the root route and giving response,the root route is set as user home page
router.get('/', (req, res) => {
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

router.get('/signup',(req,res)=>{
    res.render('user/signup');
})

router.post('/signup',(req,res)=>{
    userHelper.doSignup(req.body).then((resp,err)=>{
        if(resp){
            res.redirect('/');
        }else{
            res.redirect('/signup');
        }
    })
})


module.exports =  router;