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
const multer = require('multer');
app.use(express.static(public))

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

const stockage = multer.diskStorage({
    destination : (req , file , callback) => {
        callback(null , 'public');
    },
    filename: (req , file , callback) => {
        callback(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({stockage}).array('file')

app.post('upload', function (req, res) {

upload(req ,res => {

    if(err) {
        return res.status(500).json(err)
    }
        req.files.map(file => {
            console.log(file);

        })

        return request.status(200).json(req.files)

})
})

app.post('/api/signup', function (req, res) {
    console.log(req.body);
    const DataUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,10 ),
        age: req.body.age,
        tel: req.body.tel,
        picture: req.body.picture,
        dob_day: req.body.dob_day,
        dov_month: req.body.dov_month,
        dob_year: req.body.dob_year,
        gender_identity: req.body.gender_identity,
        gender_interest: req.body.gender_interest


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
        // res.json({username : user.username})
        res.redirect("http://localhost:3000/homepage")
    }).catch(err => {console.log(err)});
});

app.get('/allusers', function(req, res) {
    User.find().then(data => {
        res.json({data: data});
    }).catch(err => {console.log(err)});
    })

