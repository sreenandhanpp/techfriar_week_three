//importing modules
const mongoose = require('mongoose');


//defining the structure of the collection
const newUserSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});

//creating the model
const newUser = mongoose.model('user',newUserSchema);

module.exports = newUser;