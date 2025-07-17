const express = require("express");
const {
  createNewBlogController,
  updateBlogController,
  deleteBlogController,
  fetchAllBlog,
  likeBlog,
  undoLikeBlog,
  unLikeBlog,
  undoUnlikeBlog,
} = require("../controllers/blog-controller");
const isUserAdminOrSuperAdmin = require("../middleware/isUserAdminOrSuperAdmin");
const { isUserMiddleWare } = require("../middleware/checkUserRole");
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

/**
 * @swagger
 * /api/v1/blog/update-blog:
 *   put:
 *     tags:
 *       - Blog
 *     security:
 *       - bearerAuth: []
 *     summary: Update new Blog
 *     description: To Update blog , you have to be admin or super admin.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: Blog id is required to update the blog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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


/**
 * @swagger
 * /api/v1/blog/like-blog:
 *   put:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     summary: Like Blog
 *     description: To like blog , you have to be register user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blogId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog like successfully
 *       400:
 *         description: Invalid input
 */
blogRouter.put("/like-blog", isUserMiddleWare, likeBlog);

/**
 * @swagger
 * /api/v1/blog/undo-like-blog:
 *   put:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     summary: Like Blog
 *     description: To undolike blog , you have to be register user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blogId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog undolike successfully
 *       400:
 *         description: Invalid input
 */
blogRouter.put("/undo-like-blog", isUserMiddleWare, undoLikeBlog);

/**
 * @swagger
 * /api/v1/blog/unlike-blog:
 *   put:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     summary: Unlike Blog
 *     description: To unlike blog , you have to be register user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blogId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog unlike successfully
 *       400:
 *         description: Invalid input
 */
blogRouter.put("/unlike-blog", isUserMiddleWare, unLikeBlog);

/**
 * @swagger
 * /api/v1/blog/undo-unlike-blog:
 *   put:
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     summary: Unlike Blog
 *     description: To undo-unlike blog , you have to be register user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blogId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog undo-unlike successfully
 *       400:
 *         description: Invalid input
 */
blogRouter.put("/undo-unlike-blog", isUserMiddleWare, undoUnlikeBlog);

module.exports = blogRouter;
