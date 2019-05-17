var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User    = require("./models/user"),
    seedDB     = require("./seeds");

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

var url = process.env.DATABASE_URL || "mongodb://localhost:27017/yelp_camp"; 
mongoose.connect(url, { useNewUrlParser: true })
    .then(() => console.log("Connection Successful"))
    .catch(err => console.log(err));

// seedDB();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

//Passport Configuration ========
app.use(require("express-session")({
    secret:"My name is Divya Mohan",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
  res.locals.currentUser = req.user; 
  next();
});
app.use(commentRoutes);
app.use(indexRoutes);
app.use(campgroundRoutes);
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server Started...");
});