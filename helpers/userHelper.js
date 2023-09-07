const newUser = require('../MongoDb/models/userModels/signup.js');
const bcrypt = require('bcrypt');

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve,reject)=>{
            userData.password = await bcrypt.hash(userData.password,10);
            const user = new newUser({
                name: userData.name,
                email: userData.email,
                password: userData.password
            });
            user.save(user).then((data)=>{
                resolve(data,null);
            }).catch(err => {
                resolve(null,err);
            })
        })
    }
}