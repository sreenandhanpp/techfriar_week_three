const express = require('express');
const userHelper = require('../helpers/userHelper');
const adminHelper = require('../helpers/adminHelper');
const isAdmin = require('../middlewares/isAdmin');
const signupValidator = require('../middlewares/signupValidator');
const { validationResult } = require('express-validator');
const isLog = require('../middlewares/isLog');
const router = express.Router();

//admin root route
router.get('/',isAdmin, (req,res)=>{
    //getting all users data and then rendering the hbs with the data object 
    adminHelper.fetchUsers().then((data)=>{
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.render('admin/index', { data } );
    })
});

//updating the users route 
router.get('/edit-user/:id',(req,res)=>{
    /*fetching the selected user data 
    req.params.id gets the id passes through the URL
    function matches this id with all users in the database and fetch the one 
    and render the single user data
    */
    adminHelper.getUserDetails(req.params.id).then((userDetails)=>{
        console.log(userDetails);
        res.render('admin/edit-user', {userDetails})
    })
});

//updating the user 
router.post('/edit-user/:id',signupValidator,(req,res)=>{
    /*
    Updating the selected user data,req.params.id gets the id passes through the URL
    function matches this id with all users in the database and Update the one 
    and redirect to admin dashboard
    */
    adminHelper.updateUserDetails(req.params.id,req.body).then(()=>{
        res.redirect('/admin');
    })
});

//delete user route
router.get('/delete-user/:id',(req,res)=>{
    /* 
    Deleting the selected user,req.params.id gets the id passes through the URL
    function matches this id with all users in the database and Delete the one 
    and redirect to admin dashboard
    */
    adminHelper.deleteUser(req.params.id).then((resp)=>{
        res.redirect('/admin');
    });
});

//creating user route get
router.get('/create-user',isAdmin,(req,res)=>{
    /* 
    render the the submition form 
    */
    let error = req.session.errors;
    res.render('admin/create-user',{error});
});
 
//create user post route 
router.post('/create-user',signupValidator,(req,res)=>{
    //getting any error on form validation
    const err = validationResult(req);
    //if there is any error redirect to user create page and render with error alert
    if(err.msg){
        req.session.errors = err.array();
        res.redirect('/admin/create-user');
    }else{
        //if there is no error create user with form data
        userHelper.doSignup(req.body).then((resp, err) => {
            if (resp) {
                res.redirect('/admin');
            } else {
                res.redirect('/admin');
            }
        });
    }
});
module.exports =  router;