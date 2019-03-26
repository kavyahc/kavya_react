const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinaryStorage = require("multer-storage-cloudinary");
const cors = require('cors');

require("./mongo.js");
require("./model/image");

const Image = mongoose.model("images");

app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "demo",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});
const parser = multer({ storage: storage });

app.post("/api/imageUpload", parser.single("image"), (req, res) => {
  console.log('req.file-------------------------',  req.file); // to see what is returned to you
  const image = {};
  image.url = req.file.url;
  image.id = req.file.public_id;
  image.description = req.body.description;
  console.log('---------am i getting objet here>?????....', image)
  Image(image)
    .save() // save image information in database
    .then(newImage => {
      console.log("------------", newImage);
      res.json(newImage);
    })
    .catch(err => console.log(err));
});

app.post("/api/texts", parser.single("newImage"), (req, res) => {
  const image = {};
  image.title = req.body.title;
  image.body = req.body.body;
  Image(image)
    .save() // save image information in database
    .then(newImage => {
      console.log("------------", newImage);
      res.json(newImage);
    })
    .catch(err => console.log(err));
});


app.get("/api/search/:search", (req,res) => {
    let search = req.params.search;
    console.log('------', search)
    Image
    .find({ 
        $text: {$search: search }
    })
    .then(response => {
        console.log('search is------', response)
        res.json(response)
    })
})
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
