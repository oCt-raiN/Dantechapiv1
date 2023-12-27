const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session')

passport.serializeUser = function(user,done){
    done(null,user.id);
}
passport.deserializeUser (function(id,done){
    user.findById(id,function  (err,user){
        done(err,user);
    });     
})
passport.use(new GoogleStrategy({
    clientID: "775313709664-t67ehud23togp7acdttjno3bhachc4nk.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:6000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));