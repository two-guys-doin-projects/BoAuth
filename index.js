import { dirname} from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
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

app.set('view engine', 'ejs');
const filePath = fileURLToPath(import.meta.url);
const viewsPath = path.join(path.dirname(filePath), 'views');
app.set('views', viewsPath);
app.use(cors({origin: "*", credentials: true}))
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 'connect-src *');
  next();
});
app.use(Session({secret: 'sso_SECRET_key', resave: true, saveUninitialized: true}));
app.use(Passport.initialize());
app.use(Passport.session());
app.use(express.urlencoded({ extended: true }));

Passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  Passport.deserializeUser(async (id, done) => {
    try {
      const user = await db_ops.getUserByID(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

Passport.use(new LocalStrategy(
    async (username, password, done) => {
      const user = await db_ops.validateUser(username, password);
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

app.post('/auth', Passport.authenticate('local', {
  failureRedirect: '/bruh', // Redirect on authentication failure
}), (req, res) => {
  res.set("Content-Security-Policy", "default-src '*'");
  // If authentication succeeds, you reach this point
  const user_identity = {
    id: `boauth_${req.user.id}`,
    name: req.user.username
  };

  const user_token = jwt.sign(user_identity, JWT_KEY);

  // Redirect the user to the specified destination
  const redirectTo = req.body.returnTo || '/login';
  res.redirect(redirectTo + `?token=${user_token}`);
});

app.get('/login', (req, res, next) => {
  const template_vars = {
    redirect: req.query.redirectback
  }
  res.render('login', template_vars)
  res.end()
  console.log('response ended on /login')
})

// API bootstrap
app.listen(APPLICATION_PORT, () => {
    console.log(`Server active on port ${APPLICATION_PORT}`)
})
