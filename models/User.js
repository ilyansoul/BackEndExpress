const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username : {type : String, required: true},
    email : {type : String, required: true},
    password : {type : String, required: true},
    age : { type: Number},
    tel : { type : Number},
    picture : { type : String },
    dob_day: { type : Date },
    dob_month: { type : Date },
    dob_year: { type : Date },
    gender_identity: { type : String },
    gender_interest: { type : String },
    // admin : {type: Boolean}
    
})

module.exports = mongoose.model('User', userSchema)
