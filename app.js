//importing modules
const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/user.js');
const adminRouter = require('./routes/admin.js');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const connectDB = require('./MongoDb/connect.js');

//configure the dotenv library
dotenv.config();

//taking the values from .env file
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

//creating the server from express library
const app = express();

//encoding the url to make the data passed through it to a object 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//setting up view engine which help us to send dynamic data in html,Here we are using handlebars 
app.set('view engine', 'hbs')
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutDir: path.join(__dirname + '/views/layout/'),
    partialDir: path.join(__dirname + '/views/partials/'),
}))

//setting up the static directory,Make the server know that the static files are stored in public directory
app.use(express.static(path.join(__dirname, '/public/')));

//setting up the session,when the user make a reqest to the server the session starts 
app.use(session({
    secret: "secret key",
    cookie: { maxAge: 600000 },
    resave: false,
    saveUninitialized: false
}))

//seperates routes for normal user and admin(we call normal user as user )
app.use('/admin', adminRouter);
app.use('/', userRouter);

//function to start the server
const StartServer = (MONGODB_URL) => {

    //passing mongoDB url to database connecting function
    connectDB(MONGODB_URL);
    //make the server to listen the port  
    app.listen(PORT, () => {
        console.log(`Server started ${PORT}`)
    });
};

StartServer(MONGODB_URL);
