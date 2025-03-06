const { type } = require("express/lib/response");
const { string } = require("joi");
const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  nationality: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  image: {
    type: String,
    default: "defalut-avatar.png",
  },
},{timestamps:true});


const Author =  mongoose.model("Author",AuthorSchema);

module.exports = {Author};