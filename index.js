const express = require("express")
const { json } = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const routes = require("./route")
require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.jji7d.mongodb.net/ShoppingApp?retryWrites=true&w=majority`, (e) => {
  if (e) {
    console.log("error", e)
    return;
  }
  console.log("connected")
})

const app = express()


app.use(cors())
app.use(json({ limit: "10mb" }))
app.use("/shop", express.static("images"), routes)
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
})
app.listen(process.env.PORT || 2003, () => console.log("App listening on 2003"))
