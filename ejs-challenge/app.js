//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { forEach, isInteger, find } = require("lodash");
const mongoose = require("mongoose")
const port = process.env.PORT || 3001;

mongoose.connect("mongodb+srv://Mark1127:<password>@cluster0.pwkzxza.mongodb.net/blogDB")

const homeStartingContent = "Hello, this is my 'blog' style website where there is a hidden route that will allow the user to compose messages, all the while saving those messages into the database setup with MongoDB. When the page is rendered, the information is requested from the database and posted to the proper route using EJS. Due to database limitations, I am unable to grant access to the composition page, but if you'd like to test the functionality of the website please feel free to shoot me an email at mark11273@gmail.com.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

let homeBody = ''

const blogPostSchema = mongoose.Schema({
  title:{
    type: String,
    required: [true, "The title of the post is required"]
  },
  body:{
    type: String,
    required: [true, "The body of the post is required"]
  }
})

const Post = mongoose.model("Post", blogPostSchema)


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//HOME ROUTE FUNCTIONS
app.get("/", function(req,res) {
  Post.find({}, function(err, posts){
    res.render("home", {
      homeContent:homeStartingContent, 
      postInfo:posts
    })
  })
})

//ABOUT ROUTE FUNCTIONS
app.get("/about", function(req, res){
  res.render("about", {aboutParagraph:aboutContent})
})

//CONTACT ROUTE FUNCTIONS
app.get("/contact", function(req, res) {
  res.render("contact", {contactParagraph:contactContent})
})

//COMPOSE ROUTE FUNCTIONS
app.get("/compose", function(req, res){
  res.render("compose")
})

app.post("/compose", function(req, res){
  const postInfo = {
    title: req.body.postTitle,
    content: req.body.postBody
  }

  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  })

  post.save(function(err) {
    if (!err) {
      res.redirect("/")
    }
  })
})

//POST PAGES ROUTE FUNCTIONS
app.get("/posts/:postId", function(req, res){
  const requestedTitle = (req.params.postId)
  Post.findOne({_id: requestedTitle}, function(err, posts){
    res.render(`post`, {
      title: posts.title,
      body: posts.body
    })
  })
})

app.listen(port, function() {
  console.log("Server started on port " + port);
});
