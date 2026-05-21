if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");

const listings = require("./routes/listing.js")
const reviews = require("./routes/listing.js")
const userRouter = require("./routes/user.js")

main() 
    .then(() => {           
        console.log("connection successful");
    })   
    .catch(err => console.log(err));  
  
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//sessions 
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());//every request ke liye passport initialize ho jayega
//session: user ko ek baar he login krna pade baar baar har ek request prr login na krna pade
app.use(passport.session());//ek website ko pta hona chaheye ek page se dusre page to request jari hai toh kya mera same user same request bhej rha web server prr
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.currUser = req.user; 
  next();
})

app.get("/demouser", async(req, res) => {
  let fakeUser = new user({
    email: "student@gmail.com",
    username: "delta_student",
  })

  let registeredUser = await user.register(fakeUser, "helloworld");
  res.send(registeredUser);
})


//routes file se aya acquire kiya
app.use("/listings", listings); //single line is used for all restfull apis
app.use("/listings/:id/reviews", reviews); //listings/:id/reviews ye har route mai common tha isliye ye use hoga
app.use("/", userRouter);




app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "page Not Found!"));
})

//error handling middleware
app.use((err, req, res, next) => {
  let {statusCode = 500, message ="sommething went wrong" } = err;
  res.render("error.ejs", {message});
  // res.status(statusCode).send(message);
}) 

app.listen(8080, () => {
    console.log("server is listening to port 8080")
}) 