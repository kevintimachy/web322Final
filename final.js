const bcrypt = require('bcryptjs');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var uri = "mongodb+srv://ktimachy:NJDuRTyq2BM3tTN@senecaweb.qyruqul.mongodb.net/web322Final?retryWrites=true&w=majority";

var userSchema = new Schema({
    "email": {
        type: String,
        unique: true
    },
    "password": String
});

let User;

exports.startDB = function () {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function (error) {
            if (error) {
                console.log("Cannot connect to DB.");
                reject(error);
            } else {
                User = db.model("finalUsers", userSchema);
                resolve();
            }
        });
    });
};

exports.register = function (user) {
    return new Promise((resolve, reject) => {
        if (user.email.trim() === "" || user.password.trim() === "")
            reject("Error: email or password cannot be empty.");
        else {
            bcrypt.hash(user.password, 10)
                .then(hash => {
                    user.password = hash;
                    let newUser = new User(user);
                    newUser.save()
                        .then(() => {
                            resolve(user);
                        })
                        .catch((err) => {
                            if (err.code == 11000)
                                reject("Error: " + user.email + " already exists");
                            else
                                reject("Error: cannot create the user")

                        });
                })
                .catch(err => reject("There was an error encrypting the password"));
        }
        
    });
}

exports.signIn = function (user) {
    return new Promise((resolve, reject) => {
        User.findOne({ email: user.email }).exec()
            .then((foundUser) =>
            {
                bcrypt.compare(user.password, foundUser.password)
                    .then((result) => {
                        if (result) 
                            resolve(user);
                        else
                            reject("Incorrect password for user " + user.email);
                    });
            })
            .catch(err => {
                reject("Cannot find the user: " + user.email)
            });
    });
}