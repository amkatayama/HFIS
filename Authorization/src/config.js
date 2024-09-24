const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/Login-tut");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password1: {
        type: String,
        required: true
    },
    password2: {
        type: String,
        required: true
    }
});

// collection part
const User = mongoose.model('User', Loginschema);

module.exports = User;