const { check,validationResult } = require('express-validator');

//validaing form
module.exports = [
    check('name','username atleast contains 4 characters')
    .isLength({ min: 4 }),
    check('email','Invalid email')
    .isEmail()
    .normalizeEmail(),
    check("password", "Password must contain 4 characters")
    .isLength({ min: 4 })
    .custom((value,{req, loc, path}) => {
        if (value !== req.body.confirmPass) {
            // trow error if passwords do not match
            throw new Error("Passwords don't match");
        }else{
            return value;
        }
    })
]