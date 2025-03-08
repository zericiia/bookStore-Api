
const Joi = require("joi");
const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 200,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
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

// functions
function validateAuthorCreation(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(2).max(200).required(),
    lastName: Joi.string().trim().min(2).max(200).required(),
    nationality: Joi.string().trim().min(2).max(100).required(),
    image: Joi.string(),
  });
  return ({ error } = schema.validate(obj));
}

function validateAuthorUpdate(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(2).max(200),
    lastName: Joi.string().trim().min(2).max(200),
    nationality: Joi.string().trim().min(2).max(100),
    image: Joi.string(),
  });
  return ({ error } = schema.validate(obj));
}

const Author =  mongoose.model("Author",AuthorSchema);

module.exports = {Author ,validateAuthorCreation,validateAuthorUpdate};