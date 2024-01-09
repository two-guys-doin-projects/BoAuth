import { dirname} from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname)
import express from 'express'
import  Session from "express-session"
import  Passport from "passport"
import {APPLICATION_PORT, JWT_KEY} from './config.js'
import db_ops from './db_connection.js'
import jwt from 'jsonwebtoken'
import {Strategy as LocalStrategy} from 'passport-local'



// Init step
const app = express();
const __dirname = resolve();
app.engine(
  'js',
  htmlExpress({
    includesDir: 'includes',
  })
);
app.set('view engine', 'js');
app.set('views', `${__dirname}/templates`)
app.use(Session({secret: 'sso_SECRET_key', resave: true, saveUninitialized: true}));
app.use(Passport.initialize());
app.use(Passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
  });

passport.deserializeUser((id, done) => {
    const user = db_ops.getUserByID(id);
    done(null, user);
});

passport.use(new LocalStrategy(
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

app.post('/auth', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err || !user) {
        // Handle authentication failure
        return res.redirect('/login');
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

app.get('/login', (req, res, next) => {
  res.render('login', {
    redirect: req.redirectback
  })
})

// API bootstrap
app.listen(APPLICATION_PORT, () => {
    console.log(`Server active on port ${APPLICATION_PORT}`)
})
