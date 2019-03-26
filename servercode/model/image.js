const mongoose = require("mongoose");

const imagesSchema = mongoose.Schema(
  {
    title: { type: String  },
    body: { type: String, index: true }
  },
  {
    timestamps: true
  }
);
  imagesSchema.index({ body:1})

const images = mongoose.model("images", imagesSchema);
module.exports = images;
