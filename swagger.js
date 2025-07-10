const swaggerJSDoc = require("swagger-jsdoc");

const PORT = process.env.PORT;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "Blog project API Documentation for my project",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: "http://localhost:" + PORT,
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"], // paths to files with Swagger annotations
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
