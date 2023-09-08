const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('../MongoDb/models/userModels/signup')
const bcrypt = require('bcrypt');

module.exports = {
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
    getUserDetails: (user_id) => {
        return new Promise(async (resolve, reject) => {
            User.findOne({ _id: new ObjectId(user_id) }).lean().then((user) => {
                resolve(user);
            })
        })
    },
    updateUserDetails: (user_id, userDetails) => {
        return new Promise(async (resovle, reject) => {
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
    deleteUser : (user_id) => {
        return new Promise(async (resolve,reject) => {
            User.deleteOne({ _id:new ObjectId(user_id)}).then((res)=>{
                resolve(res);
            });
        })
    }
}