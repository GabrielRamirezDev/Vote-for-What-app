const BallotMeasure = require('./models/ballot')
const User = require('./models/user')
module.exports = function (app, passport, db, multer, ObjectId, twilioClient) {

  // Image Upload Code =========================================================================
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + ".png")
    }
  });
  var upload = multer({ storage: storage });


  // normal routes ===============================================================
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });


  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    let uId = ObjectId(req.session.passport.user)
    console.log("/profile user log", req.user)
    db.collection('posts').find({ 'posterId': uId }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        posts: result
      })
    })
  });



  app.post('/saveNotification', async (req, res) => {
    let search = req.body.search;
    console.log(search)
    if (search) {
      console.log("i am the user...", req.user._id);
      try {
        const updatedUser = await User.findOneAndUpdate({ _id: req.user._id }, { $addToSet: { savedQueries: search } }, { new: true })
        console.log("I am updated!", updatedUser)
        res.end()
      } catch (err) {
        console.log("user update error", err.message)
      }

    } else {
      res.end()
    }
  })




  app.post('/search', async (req, res) => {
    let search = req.body.search;
    let location = req.body.location;
    var regex = new RegExp(["^", location, "$"].join(""), "i")
    if (location && search) {
      try {
        const ballots = await BallotMeasure.find({ $text: { $search: search }, district_name: regex }).exec()
        res.send({
          ballot_measures: ballots
        })
      } catch (err) {
        console.log("search", err.message)
      }


    } else if (location) {
      db.collection('ballot_measures').find({ district_name: regex }).toArray((err, result) => {
        if (err) return console.log(err)
        console.log("the result is...", result)
        res.send({
          ballot_measures: result
        })
      })

    } else {
      db.collection('ballot_measures').find({ $text: { $search: search } }).toArray((err, result) => {
        if (err) return console.log(err)
        res.send({
          ballot_measures: result
        })
      })
    }
  })

  app.get('/search', function (req, res) {
    db.collection('notifications').find({ user: req.user._id }).toArray((err, result) => {
      if (err) return console.log(err)
      console.log(result);
      res.render('search.ejs', {
        notifications: result
      });
    })
  })

  app.get('/ballotDetails/:id', function (req, res) {
    let id = ObjectId(req.params.id)
    db.collection('ballot_measures').find({ _id: id }).toArray((err, result) => {
      if (err) return console.log(err)
      db.collection('follow').find({ ballotId: req.params.id }).toArray((err, followers) => {

        res.render('ballotDetails.ejs', {
          ballotDetails: result,
        });
      })
    })
  })

  app.post('/deleteSearch', async function (req, res) {
    let search = req.body.search;
    try {
      const updatedUser = await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { savedQueries: search } }, { new: true })
      res.json(updatedUser)
    } catch (err) {
      console.log("search", err.message)
    }

  })



  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
