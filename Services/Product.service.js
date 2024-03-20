import { Product } from "../models/Product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllProducts = asyncHandler(async (req, res) => {
  //as we are taking all the videos we have to filter them , apply sorting,pagination,searching,query and take all them from query
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  //we have to create empty objects so that according to our query we can they can work properly
  let filter = {};
  // If you want to perform text search filtering, you can use regular expressions or case-insensitive matching:
  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }

  //if we want to filter based on userId then
  if (userId) {
    filter.userId = userId;
  }
  //now we work on sortBy and sortType and for this same as filter we will create a object
  let sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortType === "desc" ? -1 : 1;
  }

  //now we will focus on pagination as how many page we want to display in one page and the skip of previous!!
  // let options = {

  // } now we will directly use pagination while finding video

  const product = await Product.find(filter)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit);

  //if there is no video than
  if (!product) {
    throw new ApiError(404, "There is no product");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, product, "Product fetched Successfully"));
});

const updateProductById = asyncHandler(async (req, res) => {
  //taking video id from req.params as the user is specifying it in its query and its only one thats why we used it!!
  const { productId } = req.params;

  //now take the details which we have to update!!
  const { name, price, quantity } = req.body;

  //check if id is valid or not !!
  if (!isValidObjectId(productId)) {
    throw new ApiError(404, "provided product id for update is invalid!!");
  }

  //find video by mongoose methods!!
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      name,
      price,
      quantity,
    },
    { new: true }
  ); //in findByIdAndUpdate, old value is returned so to get new values we use new :true , keyword

  if (!updatedProduct) {
    throw new ApiError(404, "video to be updated not found!!");
  }

  //return the response!!
  return res
    .status(201)
    .json(new ApiResponse(200, updatedProduct, "Video Updated Successfully!!"));
});
export { getAllProducts,updateProductById };
