const blogsRouter = require("./routes/blogsRouter.js");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const mongoUrl = `mongodb+srv://fulstack:testing123@cluster0.rl8qyp8.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(mongoUrl);

app.use("/api/blogs", blogsRouter);

module.exports = app;
