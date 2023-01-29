const express = require('express');
var app = express();
const fs = require('fs')
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
mongoose.set('strictQuery', false)
mongoose.connect('mongodb+srv://ilyan17:ilyan17@cluster0.xtjt56g.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("MongoDB Connected !"))
.catch(err => console.log("error : " + err));
app.get('/', (req, res) => {
    res.json('Hello to my app')
})
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
const upload = multer({stockage}).array('file')

app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err)
      } else if (err) {
        return res.status(500).json(err)
      }
      req.files.map(file => {
        console.log(file)
      })
      return res.status(200).json(req.files)
    })
  })

app.post('/api/signup', function (req, res) {
    console.log(req.body);
    const DataUser = new User({
        user_id: req.body.user_id,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,10 ),
        tel: req.body.tel,
        url: req.body.url,
        dob_day: req.body.dob_day,
        dov_month: req.body.dov_month,
        dob_year: req.body.dob_year,
        gender_identity: req.body.gender_identity,
        gender_interest: req.body.gender_interest
    })

    const existingUser =  DataUser.findOne({tel})

    if (existingUser) {
        return res.status(409).send('User already exists')
    }

    

    DataUser.save().then(() => {
        console.log('User saved');
        res.redirect('http://localhost:3000/login')
    })
})
app.post('/api/login', function(req, res) {
    User.findOne({
        email : req.body.email
    }).then(user => {
        if (!user){
            res.status(404).send('Email Invalid !');
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

    app.post('/logout', (req, res) => {
        req.session.destroy((err) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error logging out');
          }
          return res.send('Logged out successfully');
        });
      });

    app.put('/user' , async (req, res) => {
        const formData = req.body.formData;
        
        const query = {user_id: formData.user_id}
        const updateDocument = {
            $set: {
                username: formData.username,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                url: formData.url,
                matches:formData.matches
            }
        }
        const insertedUser = await User.updateOne(query, updateDocument)
        res.send(insertedUser)
    }
    
    )