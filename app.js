require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Under the gentle sun, today unfolded with a tranquil touch. A morning venture into the park revealed nature's soothing whispers, rustling leaves and distant birdsong. The afternoon pages of a novel turned swiftly, each word carrying me to distant realms. As evening arrived, I turned to my journal, penning reflections that unveiled clarity and insights. Challenges surfaced too, technical glitches in a creative project demanded resourcefulness and patience. But as the sky darkened, stars emerged like scattered gems, mirroring the gratitude that enveloped me. Grateful for moments in nature's embrace, for the escape within stories, and for the solace of self-expression. The day was a reminder that tranquility and challenges are both threads in life's intricate tapestry, weaving a journey of growth and appreciation.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// let allPosts = [];
mongoose.connect("mongodb+srv://"+process.env.MONGO_CONNECT+"@cluster0.xqunpob.mongodb.net/?retryWrites=true&w=majority")
const postSchema = new mongoose.Schema({
  postTitle: String,
  postBody: String
})

app.get("/", function (req, res) {
  Post.find()
    .then(function (foundPosts) {
      res.render("home", {
        homeParagraph: homeStartingContent,
        postContent: foundPosts
      });
    })
    .catch(function (err) {
      console.log(err + " Data feching error.");
    })
});
app.get("/about", function (req, res) {
  res.render("about", { aboutParagraph: aboutContent });
});
app.get("/contact", function (req, res) {
  res.render("contact", { contactParagraph: contactContent });
});
app.get("/compose", function (req, res) {
  res.render("compose", {});
});

const Post = mongoose.model("Post", postSchema)

app.post("/compose", function (req, res) {
  const posts = new Post({
    postTitle: req.body.title,
    postBody: req.body.post
  })
  // allPosts.push(newPost) - save to mongo;
  Post.insertMany([posts])
    .then(function () {
      console.log("Your data has been saved successfully");
    })
    .catch(function (err) {
      console.log(err + " Error while saving");
    })
  res.redirect("/");
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId
  
  Post.findOne({ _id: requestedPostId })
    .then(function (post) {
      res.render("post", {
        title: post.postTitle,
        aboutPost: post.postBody
      });
    })
    .catch(function (err) {
      console.log(err + "error in last find #100")
    })
})


app.listen(1000, "0.0.0.0", function () {
  console.log("Server started on port 1000");
});
