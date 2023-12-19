const express = require('express');
const  Session =  require("express-session");
const  Passport =  require("passport");
const config =  require('./config');

// Init step
const app = express();
app.use(Session({secret: 'sso_SECRET_key', resave: true, saveUninitialized: true}));
app.use(Passport.initialize());
app.use(Passport.session());

// API routes
app.get('/', (req, res) => {
    res.send('Welcome')
})


// API bootstrap
app.listen(config.APPLICATION_PORT, () => {
    console.log(`Server active on port ${config.APPLICATION_PORT}`)
})