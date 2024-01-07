const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./database");
const database = require("./database");
const userSchema = require("./userSchema");
const passpor = require("passport")
const pass = require("passport-jwt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "kg@#jvjh68hkzdoi"
const postSchema = require("./models/postSchema")
const auth = require("./middlewares/auth")
const passport = require("./config/passport")
const location = require("./models/locationSchema");
const locationSchema = require("./models/locationSchema");

//TASK 1

const app = express();


app.use(express.json());

app.use(passport.initialize());

connectDB();

//TASK 2

//User Registration
app.post("/register", async (req, res) => {

  try {
    const { Name, email, passwprd } = req.body;

    const exitsUser = await userSchema.findOne({ email: email });
    if (exitsUser) {
      return res.status(400).json({ message: "user already exits" })
    }

    const newdata = new userSchema(req.body);

    const token = jwt.sign({ email: newdata, id: newdata._id }, SECRET_KEY, { expiresIn: "1 day" });

    const result = await newdata.save();
    const data = await userSchema.findOne({ email: email });
    return res.status(201).json({ user: newdata, token: token, message: "register succesfully" })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "intaernal server error" })

  }
});


//user Login

app.post("/api/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password

    const exitsUser = await userSchema.findOne({ email: email });
    if (!exitsUser) {
      return res.status(404).json({ message: "user not found" })
    }

    const token = jwt.sign({ email: exitsUser, id: exitsUser._id }, SECRET_KEY, { expiresIn: "1h" });
    return res.status(201).json({ user: exitsUser, token: token, message: "user login success" })


  } catch (error) {
    console.log("error");
    return res.status(500).json({ message: "internal server error!" });

  }

});


app.get("/api/protected", passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.status(201).json({ success: true, massege: "you are authorized" })
})




// TASK 3

//CRUD OPERATION

app.post("/api/auth/create", async (req, res) => {
  try {
    // const {title,body,Geolocation,active} = req.body;
    if (!req.body.latitude || !req.body.longitude) {
      return res.status(201).json({ message: "lat and log not found!" })

    }


    const post = new postSchema({
      title: req.body.title,
      body: req.body.body,
      createdBy: req.body.createdBy,
      active: req.body.active,
      inactive: req.body.inactive,
      geolocation: {
        type: "path",
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      }
    })
    const token = jwt.sign({ _id: post, id: post._id }, SECRET_KEY, { expiresIn: "1 day" });

    const result = await post.save();
    return res.status(201).json({ token: token, message: "created succesfully!" })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Somthing went wrong" });

  }
});


app.get("/api/auth/read", async (req, res) => {

  try {

    const data = await postSchema.find(req.params);
    return res.send(data)

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Somthing went wrong" });
  }
});


app.put("/auth/update/:id", async (req, res) => {

  try {

    const _id = req.params.id;

    const data = await postSchema.updateOne({ _id: req.params.id },
      {
        $set: req.body
      })
    if (!data) {
      return res.status(404).json({ message: "page not found" });
    } else {
      return res.status(200).json({ message: "update sucessfully" })
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Somthing went wrong" });
  }

});


app.delete("/auth/delete/:id", async (req, res) => {

  try {

    const id = req.params.id;

    const data = await postSchema.deleteOne({ _id: req.params.id })

    return res.status(200).json({ message: "delete sucessfully" })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Somthing went wrong" });
  }

})







//TASK 
//latitude and longitude


// Create a Post
app.post('/api/create', async (req, res) => {
  try {
    const { latitude, longitude, content } = req.body;
    const location = new locationSchema(req.body);
    await location.save();
    res.status(201).json({ massege: "successfull create" });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve Posts based on latitude and longitude
app.get('/api/retrieve', async (req, res) => {
  try {
    const location = await locationSchema.find(req.params);
    res.send(location)


  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




//TASK 5




app.get('/auth/count', async (req, res) => {
  try {
    const activeCount = await postSchema.find().countDocuments();
    const inactiveCount = await postSchema.find().countDocuments();
    res.send({ activeCount, inactiveCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(4000, () => {

  console.log("server is runninmg")
})