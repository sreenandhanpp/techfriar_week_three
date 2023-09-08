/*
for checking the login page status if the user is logged in then redirect to users corresponding 
page according to their roles, if not logged in  execute the next code
*/

module.exports = (req,res,next) => {
    if(req.session.admin){
       res.redirect('/admin')
    }else if(req.session.user){
        res.redirect('/')
    }else{
        next();
    }
};