const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    collegename: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const signup = mongoose.model("signup",signupSchema);

module.exports=signup;