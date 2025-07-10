const BlogCategory = require("../model/blogCategory");

const { asyncHandler, ApiError } = require("../middleware/ErrorHandler");

const createCategory = asyncHandler(async (req, res) => {
  const { categoryName, categoryIcon } = req.body;

  if (!categoryName) {
    throw new ApiError("categoryName is required", 400);
  }

  const category = await BlogCategory.findOne({
    categoryName: { $regex: categoryName, $options: "i" },
  });

  if (category) {
    throw new ApiError("Already have a item with the same Name", 400);
  }

  const newCategory = await BlogCategory.create({
    categoryName: categoryName,
    categoryIcon: categoryIcon,
  });

  return res.status(201).json({
    status: "Success",
    message: "New category created",
    data: newCategory,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.query.id;

  console.log("category id = " + categoryId);

  const category = await BlogCategory.findById(categoryId);

  console.log("category is found = " + category);

  if (!category) {
    throw new ApiError("No Category found", 404);
  }
  await category.deleteOne();

  return res.status(200).json({
    status: "Success",
    message: "Category Deleted",
  });
});

const fetchAllCategory = asyncHandler(async (req, res) => {
  console.log("Hit all category ");
  const category = await BlogCategory.find();

  if (!category) {
    throw new ApiError("No Category found", 404);
  }

  return res.status(200).json({
    status: "Success",
    message: "Fetch all category",
    data: category,
  });
});

module.exports = { createCategory, deleteCategory, fetchAllCategory };
