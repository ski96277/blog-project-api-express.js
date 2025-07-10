const express = require("express");

const authController = require("../controllers/auth-controller");

const authRouter = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - email
 *              - password
 *              - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               deviceToken:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
authRouter.post("/register", authController.registerController);
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Authenticates a user and returns a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - email
 *              - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
authRouter.post("/login", authController.loginController);
/**
 * @swagger
 * /api/v1/auth/social-login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login with social account
 *     description: Authenticates a user via social login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - provider
 *              - token
 *             properties:
 *               provider:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid social login
 */
authRouter.post("/social-login", authController.socialLoginController);
/**
 * @swagger
 * /api/v1/auth/create-admin:
 *   post:
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     summary: Create admin user
 *     description: Creates a new admin account but you have provide super admin login token to get access.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - name
 *              - email
 *              - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created
 *       400:
 *         description: Bad request
 */
authRouter.post("/create-admin", authController.adminCreateController);

module.exports = authRouter;
