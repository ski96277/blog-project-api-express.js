require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const { globalErrorHandler } = require("./middleware/ErrorHandler");
const authRouter = require("./routes/auth-routes.js");
const User = require("./model/User.js");
const blogRouter = require("./routes/blog-routes.js");
const categoryRoute = require("./routes/blog-category.js");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();
const port = process.env.PORT || 3000;
const mongoDB_Url = process.env.MONGODB_URL;

//connect db
mongoose
  .connect(mongoDB_Url)
  .then(async () => {
    console.log("Database connected.");

    const existing = await User.findOne({ email: "superadmin@yopmail.com" });
    if (existing) {
      console.log("Super Admin already created");
    } else {
      const user = await User.create({
        name: "Super Admin",
        email: "superadmin@yopmail.com",
        password: "superadmin",
        role: "superadmin",
      });

      console.log("Super admin created ", user);
    }
  })
  .catch((error) => {
    console.log("Database connection error " + error);
  });

//middleware
app.use(cors());
app.use(express.json());


// Serve swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//setup router
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/category",categoryRoute);

//add error handler at bottom
app.use(globalErrorHandler);
app.listen(port, () => {
  console.log("server is running on the port " + port);
});
