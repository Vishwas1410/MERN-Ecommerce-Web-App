import { TryCatch } from "../middlewares/error.js";
import { CouponModel } from "../models/couponmodel.js";
import errorHandler from "../utils/utility-class.js";
export const newCoupon = TryCatch(async (req, res, next) => {
    const { coupon, amount } = req.body;
    if (!coupon || !amount)
        return next(new errorHandler("Please Enter both Coupon And Amount", 400));
    await CouponModel.create({ code: coupon, amount });
    return res.status(201).json({ success: true, message: "Coupon Created Successfully" });
});
export const applyDiscount = TryCatch(async (req, res, next) => {
    const { coupon } = req.body;
    const discount = await CouponModel.findOne({ code: coupon });
    if (!discount)
        return next(new errorHandler("Please Enter Valid Discount", 400));
    return res.status(200).json({ success: true, discount: discount.amount });
});
export const allCoupons = TryCatch(async (req, res, next) => {
    const coupons = await CouponModel.find({});
    return res.status(200).json({ success: true, coupons });
});
export const deleteCoupon = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    await CouponModel.findByIdAndDelete(id);
    if (!id)
        return next(new errorHandler("Please Enter valid ID", 404));
    return res.status(200).json({ success: true, message: "Coupon Deleted" });
});
