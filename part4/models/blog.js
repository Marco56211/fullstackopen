const mongoose = require("mongoose");
console.log("connecting to blogs");
const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = mongoose.model("Blog", blogSchema);
