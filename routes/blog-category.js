const express = require("express");
const isUserAdminOrSuperAdmin = require("../middleware/isUserAdminOrSuperAdmin");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  fetchAllCategory,
} = require("../controllers/category-controller");

const categoryRoute = express.Router();

categoryRoute.get("/", fetchAllCategory);
categoryRoute.post("/create-category", isUserAdminOrSuperAdmin, createCategory);
categoryRoute.delete("/delete-category", isUserAdminOrSuperAdmin, deleteCategory);

module.exports = categoryRoute;
