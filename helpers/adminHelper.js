const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('../MongoDb/models/userModels/signup')
const bcrypt = require('bcrypt');

module.exports = {
    //To get all user details,then resolve the data
    fetchUsers: () => {
        return new Promise(async (resolve, rejcet) => {
            const users = await User.find({}).lean();
            if (users) {
                resolve(users);
            } else {
                resolve(null);
            }
        });
    },
    //To find One user details,then resolve the data
    getUserDetails: (user_id) => {
        return new Promise(async (resolve, reject) => {
            //matching the user id with mongodb object id 
            User.findOne({ _id: new ObjectId(user_id) }).lean().then((user) => {
                resolve(user);
            })
        })
    },
    //To update the user details 
    updateUserDetails: (user_id, userDetails) => {
        return new Promise(async (resovle, reject) => {
            // bcrypting the password with bcrypt library which convert the password into a hex value
            userDetails.password = await bcrypt.hash(userDetails.password,10);
            User.updateOne({ _id: new ObjectId(user_id) }, {
                $set: {
                    name: userDetails.name,
                    email: userDetails.email,
                    password: userDetails.password
                }
            }).then(()=>{
                resovle();
            })
        });
    },
    //To Delete the user Details
    deleteUser : (user_id) => {
        return new Promise(async (resolve,reject) => {
            User.deleteOne({ _id:new ObjectId(user_id)}).then((res)=>{
                resolve(res);
            });
        })
    }
}