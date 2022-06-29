const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: { type: String},
    name: {
      type: String,
      default: ""
    },
    profilePic: {
      type: String,
      default: "",
    },
    bio:{
      type: String,
      default: ""
    }

  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = UserSchema;
