const express = require('express');
const userHelper = require('../helpers/userHelper');
const adminHelper = require('../helpers/adminHelper');
const isAdmin = require('../middlewares/isAdmin');
const router = express.Router();


router.get('/',isAdmin, (req,res)=>{
    adminHelper.fetchUsers().then((data)=>{
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.render('admin/index', { data } );
    })
});

router.get('/edit-user/:id',(req,res)=>{
    adminHelper.getUserDetails(req.params.id).then((userDetails)=>{
        console.log(userDetails);
        res.render('admin/edit-user', {userDetails})
    })
});

router.post('/edit-user/:id',(req,res)=>{
    adminHelper.updateUserDetails(req.params.id,req.body).then(()=>{
        res.redirect('/admin');
    })
});

router.get('/delete-user/:id',(req,res)=>{
    adminHelper.deleteUser(req.params.id).then((resp)=>{
        res.redirect('/admin');
    });
});

router.get('/create-user',(req,res)=>{
  res.render('admin/create-user');
});

router.post('/create-user',(req,res)=>{
    userHelper.doSignup(req.body).then((resp, err) => {
        if (resp) {
            res.redirect('/admin');
        } else {
            res.redirect('/admin');
        }
    });
});
module.exports =  router;