const User = require('../MongoDb/models/userModels/signup.js');
const bcrypt = require('bcrypt');

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve,reject) => {
            userData.password = await bcrypt.hash(userData.password,10);
            const user = new User({
                name: userData.name,
                email: userData.email,
                password: userData.password
            });
            user.save(user).then((data)=>{
                resolve(data,null);
            }).catch(err => {
                resolve(null,err);
            });
        });
    },
    doLogin: (userData) => {
        const adminEmail = "admin@gmail.com";
        const adminPass = "admin@123";
        return new Promise(async (resolve,rejecet) => {
            let response = {}
            if(adminPass == userData.password && adminEmail == userData.email){
                response.admin = true;
                resolve(response);
            }else{
                const user = await User.findOne({email:userData.email});
                if(user){
                    bcrypt.compare(userData.password,user.password).then(status=>{
                        if(status){
                            response.name = user.name;
                            response.admin = false;
                            response.status = true
                            resolve(response);
                        }else{
                            resolve({status:false});
                        }
                    })
                }else{
                    resolve({status:true})
                }
            }
        });
    }
};