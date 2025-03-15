const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required : true,
        trim : true,
        minlenght : 5,
        maxlenght : 100,
        unique: true,
    }
    
})