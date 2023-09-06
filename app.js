const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/user.js');
const adminRouter = require('./routes/admin.js');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');


dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs')
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutDir: path.join(__dirname + '/views/layout/'),
    partialDir: path.join(__dirname + '/views/partials/'),
}))
app.use(express.static(path.join(__dirname, '/public/')));
app.use(session({
    secret: "secret key",
    cookie: { maxAge: 600000 },
    resave: false,
    saveUninitialized: false
}))
app.use('/admin', adminRouter);
app.use('/user', userRouter);

/*
Cache-Control - controls the caching behaviour in the browser
Private - the respones is intended for a single user and should not be shared(in proxy servers)
no-cache - it allow to store cache but it revalidate the cache with the server before using a cached version
no-store - it prevent from storing cache
must-revalidate - it makes the cliet to revalidate cache on every server request 
*/
app.get('/', (req, res) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('user/index');
})

app.listen(PORT, () => {
    console.log(`Server started ${PORT}`)
})