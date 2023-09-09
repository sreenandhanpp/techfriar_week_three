const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const dotenv = require('dotenv');

dotenv.config();

//configuring facebook authentication
/*
 Define the "authUser" function, and authenticate the user.   
 Pass this {authenticate_user} to the passport.serialize()
*/
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true,
},
  (req, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));


/*
attach the {authenticate_user} to 
req.session.passport.user.{authenticated_user}  
*/
passport.serializeUser((user, done) => {
  done(null, user);
})

/*
get the {authenticated_user} for the session from    
"req.session.passport.user.{authenticated_user}, and attach it to req.user
*/
passport.deserializeUser((user, done) => {
  done(null, user);
})