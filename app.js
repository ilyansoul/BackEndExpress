const express = require('express');
var app = express();

const bcrypt = require('bcrypt');
const cors = require('cors');
app.use(cors());



const {createToken , validateToken} = require('./JWT')
const cookieParser = require('cookie-parser');
app.use(cookieParser());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

require('dotenv').config();
const server = app.listen(5000, function () {
    console.log('server listening on port 5000')
})
const mongoose = require('mongoose');
const { request } = require('express');

const User = require('./models/User')


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
    console.log(req.body);
    const DataUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,10 )
    })
    DataUser.save().then(() => {
        console.log('User saved');
        res.redirect('http://localhost:3000/login')
    })
})

app.post('/api/login', function(req, res) {
    User.findOne({
        username : req.body.username
    }).then(user => {
        if (!user){
            res.status(404).send('User Invalid !');
        }

        // const accessToken = createToken(user);

        // res.cookie("access-token", accessToken, {maxAge: 60*60*24*30*12, httpOnly:true})

        
        if(!bcrypt.compareSync(req.body.password, user.password)){
            res.status(404).send('Password Invalid !');
        }
        const accessToken = createToken(user);
        res.cookie("access-token", accessToken, {maxAge: 60*60*24*30*12, httpsOnly:true})

        // res.render('UserPage', {data: user});
        res.redirect("http://localhost:3000/homepage")
    }).catch(err => {console.log(err)});
});
