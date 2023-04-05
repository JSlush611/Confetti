const subscriber = require("./models/subscriber");
const User = require("./models/user");

const uri = "mongodb+srv://jschlues611:l0M5wKjhny4THcxI@joncluster.frctr1m.mongodb.net/recipe_db?retryWrites=true&w=majority",
    mongoose = require("mongoose"),
    Subscriber = require("./models/subscriber"),
    Course = require("./models/course");

mongoose.connect(uri,{useNewUrlParser: true});


const db = mongoose.connection;
db.once("open", async () => {console.log("Connected af!")

  db.dropCollection("users");
  db.dropCollection("contacts");
  var testUser;

  await User.create({
    name: {
      first: "Jon",
      last: "Wexler"
    },
    email: "testingaf@gmail.com",
    password: "fakeasf"
  }).then(user => testUser = user);

  await Subscriber.create({
    name: "Bob",
    email: "testingaf@gmail.com",
    zipCode: 12345
  })

  var targetSub;

  await Subscriber.findOne({email: "testingaf@gmail.com"})
  .then(sub => targetSub = sub);

  testUser.subscribedAccount = targetSub;
  await testUser.save().then(user => console.log("user updated"));

})
