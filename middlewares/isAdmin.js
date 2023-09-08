/*
checking the user is admin,if admin executes the next function 
*/

module.exports = (req,res,next) => {
    if(req.session.admin){
        next();
    }else{
        res.redirect('/login');
    }
}