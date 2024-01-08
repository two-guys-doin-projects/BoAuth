const express = require('express');
const  Session =  require("express-session");
const  Passport =  require("passport");
const LocalStrategy = require("passport-local");
const {APPLICATION_PORT, JWT_KEY} =  require('./config');
const db_ops = require('./db_connection')
const jwt = require('jsonwebtoken')

// Init step
const app = express();
app.use(Session({secret: 'sso_SECRET_key', resave: true, saveUninitialized: true}));
app.use(Passport.initialize());
app.use(Passport.session());

Passport.serializeUser((user, done) => {
    done(null, user.id);
  });

Passport.deserializeUser((id, done) => {
    const user = db_ops.getUserByID(id);
    done(null, user);
});

Passport.use(new LocalStrategy(
    (username, password, done) => {
      const user = db_ops.validateUser(username, password);
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      return done(null, user);
    }
  ));

// API routes
app.get('/', (req, res) => {
    res.send('Welcome')
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err || !user) {
        // Handle authentication failure
        return res.redirect('/login-page');
      }
  
      // Assuming you have some property like 'returnTo' in the request
      const redirectTo = req.body.returnTo || '/login';
  
      // Issue a JWT or perform any other necessary actions
      
      const user_identity = {
        id: `boauth_${user.id}`,
        name: user.username
      }

      const user_token = jwt.sign(user_identity, JWT_KEY)

      // Redirect the user to the specified destination
      return res.redirect(redirectTo + `?token=${user_token}`);
    })(req, res, next);
  });



// API bootstrap
app.listen(APPLICATION_PORT, () => {
    console.log(`Server active on port ${APPLICATION_PORT}`)
})
