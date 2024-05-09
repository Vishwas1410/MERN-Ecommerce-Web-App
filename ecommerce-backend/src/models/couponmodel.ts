import mongoose from "mongoose";


const schema = new mongoose.Schema({
    code:{
        type:String,
        required:[true,"Please Enter Coupon Code"],
        unique:true
    },
    amount:{
        type:Number,
        required:[true,"Please Enter Discount Amount"]
    }
    
})

export const CouponModel = mongoose.model("Coupon", schema)