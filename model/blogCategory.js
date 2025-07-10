const mongoose = require("mongoose");

const blogCategory = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },

    categoryIcon: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", blogCategory);
