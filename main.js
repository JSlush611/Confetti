const subscriber = require("./models/subscriber");

const express = require("express"),
    app = express(),
    layouts = require("express-ejs-layouts"),
    homeController = require("./controllers/homeControllers"),
    errorController = require("./controllers/errorController"),
    userController = require("./controllers/userController"),
    User = require("./models/user"),
    courseController = require("./controllers/coursesController"),
    subscriberController = require("./controllers/subscribersController"),
    uri = "mongodb+srv://user:pass/recipe_db?retryWrites=true&w=majority",
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSession = require("express-session"),
    cookieParser = require("cookie-parser"),
    connectFlash = require("connect-flash"),
    expressValidator = require("express-validator"),
    passport = require("passport");


mongoose.connect(uri,{useNewUrlParser: true});
const router = express.Router();
router.use(methodOverride("_method", {methods: ["POST", "GET"]}));
router.use(cookieParser("passcodeafaf"));
router.use(expressSession({
    secret: "passcodeafaf",
    cookie: {
        maxAge: 4000000
    }
}))
router.use(connectFlash());


router.use(passport.initialize());
router.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});


const db = mongoose.connection;
db.once("open", () => {console.log("Connected af!")})

    
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(layouts);
app.set("port", process.env.PORT || 3000);
app.use(express.urlencoded({extended: false}), express.json());
router.use(expressValidator());
app.use("/", router);

router.get("/", (req, res, next) => { console.log(req.flash("success")); next();}, homeController.getHome);

router.get("/users", userController.index, userController.indexView);
router.get("/users/login", userController.login);
router.post("/users/login", userController.authenticate);
router.get("/users/logout", userController.logout, userController.redirectView);
router.get("/users/new", userController.new);
router.post("/users/create", userController.validate, userController.create, userController.redirectView);
router.get("/users/:id", userController.show, userController.showView);
router.get("/users/:id/edit", userController.edit);
router.put("/users/:id/update", userController.update, userController.redirectView);
router.get("/users/:id/delete", userController.delete, userController.redirectView);

router.get("/subscribers", subscriberController.index, subscriberController.indexView);
router.get("/subscribers/new", subscriberController.new);
router.post("/subscribers/create", subscriberController.create, subscriberController.redirectView);
router.get("/subscribers/:id", subscriberController.show, subscriberController.showView);
router.get("/subscribers/:id/edit", subscriberController.edit);
router.put("/subscribers/:id/update", subscriberController.update, subscriberController.redirectView);
router.get("/subscribers/:id/delete", subscriberController.delete, subscriberController.redirectView);


router.get("/courses", courseController.index, courseController.indexView);
router.get("/courses/new", courseController.new);
router.post("/courses/create", courseController.create, courseController.redirectView);
router.get("/courses/:id", courseController.show, courseController.showView);
router.get("/courses/:id/edit", courseController.edit, courseController.redirectView);
router.put("/courses/:id/update", courseController.update, courseController.redirectView);
router.get("/courses/:id/delete", courseController.delete, courseController.redirectView);

app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
    console.log("Express Started");
});
