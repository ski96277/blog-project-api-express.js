const express = require("express");
const {
  createNewBlogController,
  updateBlogController,
  deleteBlogController,
  fetchAllBlog,
} = require("../controllers/blog-controller");
const isUserAdminOrSuperAdmin = require("../middleware/isUserAdminOrSuperAdmin");
const blogRouter = express.Router();

blogRouter.get("/", fetchAllBlog);
blogRouter.post(
  "/create-blog",
  isUserAdminOrSuperAdmin,
  createNewBlogController
);
blogRouter.put("/update-blog", isUserAdminOrSuperAdmin, updateBlogController);

blogRouter.delete(
  "/delete-blog",
  isUserAdminOrSuperAdmin,
  deleteBlogController
);

module.exports = blogRouter;
