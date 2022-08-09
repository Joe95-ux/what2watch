const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    password: { type: String},
    name: {
      type: String,
      default: "",
      trim: true
    },
    role: {
      type: String,
      default: "",
      trim: true
    },
    photo: {
      type: String,
      default: "",
    },
    bio:{
      type: String,
      default: "",
      trim: true
    },
    privilege:{
      type: String,
      trim: true
    },
    facebook:{
      type: String,
      trim: true
    },
    instagram:{
      type: String,
      trim: true
    },
    twitter:{
      type: String,
      trim: true
    },
    resetPasswordToken:String,
    resetPasswordExpires: Date


  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = UserSchema;
