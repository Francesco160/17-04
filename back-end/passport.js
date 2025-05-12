
require('dotenv').config(); 


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Author = require('./models/author'); 





passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      let user = await Author.findOne({ googleId: profile.id });
      if (!user) {
        user = await Author.create({
          googleId: profile.id,
          nome: profile.name.givenName,
          cognome: profile.name.familyName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));
  
