const Joi = require("joi");
const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    cover: {
      type: String,
      required: true,
      enum: ["soft cover", "hard cover"],
    },
  },
  { timestamps: true }
);
// validtaion functions
function validateBookCreation(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(200).required(),
    author: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/) // Validate MongoDB ObjectId
      .required()
      .messages({
        "string.pattern.base": "Author must be a valid ObjectId",
      }),
    price: Joi.number().min(0).required(),
    cover: Joi.string()
      .valid("soft cover", "hard cover") // Validate enum values
      .required(),
  });

  return schema.validate(obj);
}

//
function validateBookUpdate(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(200),
    author: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/) // Validate MongoDB ObjectId
      .messages({
        "string.pattern.base": "Author must be a valid ObjectId",
      }),
    price: Joi.number().min(0),
    cover: Joi.string().valid("soft cover", "hard cover"), // Validate enum values
  });

  return schema.validate(obj);
}

const Book = mongoose.model("Book", BookSchema);

module.exports = { Book, validateBookCreation, validateBookUpdate };
