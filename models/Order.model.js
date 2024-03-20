import mongoose,{Schema} from "mongoose";


const orderSchema = new  Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        refreshToken :{type:String, required:true}
      },
    ],
},{timestamps:true});



export const Order = mongoose.model("Order",orderSchema)