const { asyncHandler, ApiError } = require("../middleware/ErrorHandler");
const Blog = require("../model/blog");

const createNewBlogController = asyncHandler(async (req, res) => {
  console.log("requested user id is = " + req.userId);

  const { htmlContent, status, category } = req.body;
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
    category: category,
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
  const blogId = req.query.id;
  // const {htmlContent,status,category} = req.body;
  const updatedData = req.body;

  if (!blogId) {
    throw new ApiError("Blog id is required to update blog.", 400);
  }

  if (!updatedData || Object.keys(updatedData).length === 0) {
    throw new ApiError("body is required to update blog.", 400);
  }

  const blog = await Blog.findByIdAndUpdate(blogId, updatedData, {
    new: true,
    timestamps: true, //  This updates updatedAt
    runValidators: true,
  });
  if (!blog) {
    throw new ApiError("Blog not found ", 404);
  }

  return res.status(200).json({
    status: "Successfully",
    message: "blog updated",
    blog,
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

const fetchAllBlog = asyncHandler(async (req, res) => {
  console.log("Hit fetch all blog");
  const blogs = await Blog.find();
  if (!blogs) {
    throw new ApiError("No blog found found", 404);
  }

  return res.status(200).json({
    status: "Success",
    message: "fetch all blogs",
    data: blogs,
  });
});

const likeBlog = asyncHandler(async (req, res) => {

  const userId = req.userId;
  const blogId = req.body.blogId;
  if (!blogId) {
    throw new ApiError("You need pass blogId ", 400);
  }

  const blog = await Blog.findByIdAndUpdate(
    blogId,
    {
      $addToSet: { likes: userId }, // adds only if userId is not already in the array
    },
    { new: true } // optional: returns the updated document
  );

  if (!blog) {
    throw new ApiError(404, "No blog found with this id");
  }

  return res.status(200).json({
    status: "Success",
    message: "Blog like success",
    blog

  });
})

const undoLikeBlog = asyncHandler(async (req, res) => {
  const blogId = req.body.blogId;
  const userId = req.userId;
  if (!blogId) {
    throw new ApiError("blogId is required", 400);
  }

  const blog = await Blog.findByIdAndUpdate(blogId, {
    $pull: { likes: userId }, // remove user id , if userid is exits

  }, { new: true }// returns updated document
  )
  if (!blog) {
    throw new ApiError("Blog not found", 400);
  }
  return res.status(200).json({
    status: "Success",
    message: "Remove like successfully",
    blog
  });


})

const unLikeBlog = asyncHandler(async (req, res) => {

  const userId = req.userId;
  const blogId = req.body.blogId;
  if (!blogId) {
    throw new ApiError("You need pass blogId ", 400);
  }

  const blog = await Blog.findByIdAndUpdate(
    blogId,
    {
      $addToSet: { unLikes: userId }, // adds only if userId is not already in the array
    },
    { new: true } // optional: returns the updated document
  );

  if (!blog) {
    throw new ApiError(404, "No blog found with this id");
  }

  return res.status(200).json({
    status: "Success",
    message: "Blog unLike success",
    blog

  });

})

const undoUnlikeBlog = asyncHandler(async (req, res) => {


  const blogId = req.body.blogId;
  const userId = req.userId;
  if (!blogId) {
    throw new ApiError("blogId is required", 400);
  }

  const blog = await Blog.findByIdAndUpdate(blogId, {
    $pull: { unLikes: userId }, // remove user id , if userid is exits

  }, { new: true }// returns updated document
  )
  if (!blog) {
    throw new ApiError("Blog not found", 400);
  }
  return res.status(200).json({
    status: "Success",
    message: "Remove UnLike successfully",
    blog
  });


})


module.exports = {
  createNewBlogController,
  updateBlogController,
  deleteBlogController,
  fetchAllBlog,
  likeBlog,
  undoLikeBlog,
  unLikeBlog,
  undoUnlikeBlog
};
