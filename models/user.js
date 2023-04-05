const mongoose = require("mongoose"),
    Subscriber = require("./subscriber"),
    {Schema} = mongoose,
    bcrypt = require("bcrypt"),
    passportLocalMongoose = require("passport-local-mongoose");

userSchema = new Schema({
    name: {
        first: {
            type: String,
            trim: true,
            required: true
        },
        last: {
            type: String,
            trim: true,
            required: true
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    zipCode: {
        type: Number,
        min: [1000, "Zip cdoe too short"],
        max: 99999
    },
    courses: [{type: Schema.Types.ObjectId, ref: "Course"}],
    subscribedAccount: {type: Schema.Types.ObjectId, ref: "Subscriber"}
},{timestamps: true});

userSchema.pre("save", function (next) {
    if (this.subscribedAccount == undefined) {
        Subscriber.findOne({
            email: this.email
        }).then(sub => {
            this.subscribedAccount = sub;
            next();
        }).catch(error =>{
            console.log(`Error connecting subscriber ${error.message}`);
            next(error);
        });
    } else {
        next();
    }
});

/*userSchema.pre("save", function(next) {
    let user = this;
  
    bcrypt.hash(user.password, 10).then(hash => {
      user.password = hash;
      next();
    })
      .catch(error => {
        console.log(`Error in hashing password: ${error.message}`);
        next(error);
      });
  });
  
/*  userSchema.methods.passwordComparison = function(inputPassword){
    let user = this;
    return bcrypt.compare(inputPassword, user.password);
  };*/


userSchema.virtual("fullName").get(function(){
    return `${this.name.first} ${this.name.last}`;
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
    });

module.exports = mongoose.model("User", userSchema);



