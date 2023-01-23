const express = require('express');
var app = express();

const bcrypt = require('bcrypt');
const cors = require('cors');
app.use(cors());


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

require('dotenv').config();
const server = app.listen(5000, function () {
    console.log('server listening on port 5000')
})
const mongoose = require('mongoose');



var dbURL = process.env.DATABASE_URL;
console.log(dbURL);
mongoose.set('strictQuery', false)

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("MongoDB Connected !"))
.catch(err => console.log("error : " + err));

app.get('/', (req, res) => {
    res.json('Hello to my app')
})





app.post('/api/signup', function (req, res) {
    const DataUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hash(req.body.password,10 )
    })
    Data.save().then(() => {
        console.log('User saved');
        res.redirect('../')
    })
})