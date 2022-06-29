const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true,
  },
  photoTitle: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    default: "public",
    enum: ["Public", "Draft"]
  },
  category: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Story", StorySchema);
