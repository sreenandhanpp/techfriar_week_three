const User = require('../MongoDb/models/userModels/signup.js');
const bcrypt = require('bcrypt');

module.exports = {
    //Creating user 
    doSignup: (userData) => {
        return new Promise(async (resolve,reject) => {
            // bcrypting the password with bcrypt library which convert the password into a hex value
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
    //Validating User
    doLogin: (userData) => {
        //setting admin login details
        const adminEmail = "admin@gmail.com";
        const adminPass = "admin@123";
        return new Promise(async (resolve,rejecet) => {
            let response = {}
            //checking if the user is admin,if the user if admin setting admin role to true
            if(adminPass == userData.password && adminEmail == userData.email){
                response.admin = true;
                resolve(response);
            }else{
                //if it is a normal user Match the uesr email
                const user = await User.findOne({email:userData.email});
                //if the email found compare the password with bcrypt library
                if(user){
                    bcrypt.compare(userData.password,user.password).then(status=>{
                        if(status){
                            response.name = user.name;
                            response.status = true
                            resolve(response);
                        }else{
                            resolve({status:false});
                        }
                    })
                }else{
                    resolve({status:false})
                }
            }
        });
    }
};