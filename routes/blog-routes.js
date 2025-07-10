const express = require("express");
const {
  createNewBlogController,
  updateBlogController,
  deleteBlogController,
  fetchAllBlog,
} = require("../controllers/blog-controller");
const isUserAdminOrSuperAdmin = require("../middleware/isUserAdminOrSuperAdmin");
const blogRouter = express.Router();

/**
 * @swagger
 * /api/v1/blog/:
 *   get:
 *     tags:
 *       - Blog
 *     summary: Fetch All Blog
 *     description: Fetch all blog.
 *     responses:
 *       200:
 *         description: Blog fetch successfully
 *       400:
 *         description: Invalid input
 */
blogRouter.get("/", fetchAllBlog);
/**
 * @swagger
 * /api/v1/blog/create-blog:
 *   post:
 *     tags:
 *       - Blog
 *     security:
 *       - bearerAuth: []
 *     summary: Create new Blog
 *     description: Create New blog , you have to be admin or super admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - htmlContent
 *              - status
 *              - category
 *             properties:
 *               htmlContent:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - draft
 *                   - published
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Invalid input
 */
blogRouter.post(
  "/create-blog",
  isUserAdminOrSuperAdmin,
  createNewBlogController
);
blogRouter.put("/update-blog", isUserAdminOrSuperAdmin, updateBlogController);

/**
 * @swagger
 * /api/v1/blog/delete-blog:
 *   delete:
 *     tags:
 *       - Blog
 *     security:
 *       - bearerAuth: []
 *     summary: Delete Blog
 *     description: Delete blog , you have to be admin or super admin.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the blog to delete the item
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       400:
 *         description: Invalid input
 */
blogRouter.delete(
  "/delete-blog",
  isUserAdminOrSuperAdmin,
  deleteBlogController
);

module.exports = blogRouter;
