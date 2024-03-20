import { Order } from "../models/Order.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";



const createOrder = asyncHandler(async(req,res)=>{
    const {userId, productIds, quantities } =req.body;

    const user = await User.findOne(userId)

    if(!user){
        throw new ApiError(404,  "user not found");

    }

    const order = new Order({
        user:userId,
        products: productIds.map((productId, index) => ({
            product: productId,
            quantity: quantities[index],
    })),
})
   await order.save();
})


export  { createOrder }