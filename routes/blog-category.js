const express = require("express");
const isUserAdminOrSuperAdmin = require("../middleware/isUserAdminOrSuperAdmin");
const {
  createCategory,
  deleteCategory,
  fetchAllCategory,
} = require("../controllers/category-controller");

const categoryRoute = express.Router();

/**
 * @swagger
 * /api/v1/category/:
 *   get:
 *     tags:
 *       - Blog-Category
 *     summary: Fetch All Blog category
 *     description: Fetch all blog category.
 *     responses:
 *       200:
 *         description: Blog category fetch successfully
 *       400:
 *         description: Invalid input
 */
categoryRoute.get("/", fetchAllCategory);

/**
 * @swagger
 * /api/v1/category/create-category:
 *   post:
 *     tags:
 *       - Blog-Category
 *     security:
 *       - bearerAuth: []
 *     summary: Create new Blog category
 *     description: Create New blog category, you have to be admin or super admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - categoryName
 *             properties:
 *               categoryName:
 *                 type: string
 *               categoryIcon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog category created successfully
 *       400:
 *         description: Invalid input
 */
categoryRoute.post("/create-category", isUserAdminOrSuperAdmin, createCategory);

/**
 * @swagger
 * /api/v1/category/delete-category:
 *   delete:
 *     tags:
 *       - Blog-Category
 *     security:
 *       - bearerAuth: []
 *     summary: Delete Blog category
 *     description: Delete blog category, you have to be admin or super admin.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to delete the item
 *     responses:
 *       200:
 *         description: Blog category deleted successfully
 *       400:
 *         description: Invalid input
 */
categoryRoute.delete(
  "/delete-category",
  isUserAdminOrSuperAdmin,
  deleteCategory
);

module.exports = categoryRoute;
