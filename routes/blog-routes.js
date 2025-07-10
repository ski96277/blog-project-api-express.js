const express = require("express");
const {
  createNewBlogController,
  updateBlogController,
  deleteBlogController,
} = require("../controllers/blog-controller");
const isUserAdminOrSuperAdmin = require("../middleware/isUserAdminOrSuperAdmin");
const blogRouter = express.Router();

blogRouter.post("/create-blog",isUserAdminOrSuperAdmin, createNewBlogController);
blogRouter.put("/update-blog",isUserAdminOrSuperAdmin,  updateBlogController);
blogRouter.delete("/delete-blog", isUserAdminOrSuperAdmin, deleteBlogController);

module.exports = blogRouter;
