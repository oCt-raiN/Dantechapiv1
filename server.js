const express = require("express");
const cors = require("cors");
const config = require('./app/config/config');
const cookieParser = require('cookie-parser');
const app = express();
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./app/passport/passportsetup')


app.use(cors()); // Enable CORS for all routes


var corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};



app.use(cors(corsOptions));



app.use(cookieSession({
  name: 'bm-session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
// parse requests of content-type - application/json
app.use(express.json());


app.use(express.json({ limit: '100mb' }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/../client/public"));

app.use(cookieParser())

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// //drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Yakkay" });
});
// middleware
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.send(401);
  }
};
app.use(passport.initialize());
app.use(passport.session());
//app.get('/auth/google',
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email  '] }));
app.get('/notlog', (req, res) => res.send('you are not logged in'));
app.get('/failed'), (req, res) => res.send('you failed to login');
app.get('/good', isLoggedIn, (req, res) => res.send('welcome mr ${req.user.email}!'));
//app.get('/auth/google/callback', 
app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  });
app.get('/logOut', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})

require('./app/routes/user/user.routes')(app);
require('./app/routes/admin/admin.routes')(app);
require('./app/routes/organization/organization.routes')(app);
require('./app/routes/surveyForm/surveyForm.routes')(app);
require('./app/routes/profile/profile.routes')(app);
require('./app/routes/doctor/doctor.routes')(app);
require('./app/routes/order/order.routes')(app);

// set port, listen for requests
const PORT = config.port || 8000;
app.listen(PORT, () => {
  console.log();
  console.log(`Server is running on port ${PORT}.`);
});

