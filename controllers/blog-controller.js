const { asyncHandler, ApiError } = require("../middleware/ErrorHandler");
const Blog = require("../model/blog");

const createNewBlogController = asyncHandler(async (req, res) => {
  console.log("requested user id is = " + req.userId);

  const { htmlContent, status,category } = req.body;
  const author = req.userId;
  const updatedBy = req.userId;

  if (!author) {
    throw new ApiError("User id not found to create new blog", 401);
  }
  if (!htmlContent) {
    throw new ApiError("htmlContent is required", 400);
  }
  if (!status) {
    throw new ApiError("status is required", 400);
  }

  const blog = await Blog.create({
    htmlContent: htmlContent,
    status: status,
    author: author,
    updatedBy: updatedBy,
    category: category
  });

  console.log(
    "html content and status = " + htmlContent + "\n status = " + status
  );
  console.log("author id = " + author + "\n update = " + updatedBy);
  return res.json({
    status: "Success",
    Message: "Blog Created successfully",
    blog: blog,
  });
});

const updateBlogController = asyncHandler(async (req, res) => {
  return res.json({
    message: "demo success",
  });
});

const deleteBlogController = asyncHandler(async (req, res) => {
  const blogId = req.query.id;
  console.log("deleted blog id = " + blogId);
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError("Blog no found", 404);
  }
  await blog.deleteOne();

  return res.status(200).json({
    status: "success",
    message: "Blog deleted successfully",
  });
});

module.exports = {
  createNewBlogController,
  updateBlogController,
  deleteBlogController,
};
