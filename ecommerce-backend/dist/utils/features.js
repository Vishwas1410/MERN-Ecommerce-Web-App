import mongoose from "mongoose";
import { myCache } from "../app.js";
import { ProductModel } from "../models/productmodel.js";
export const connectDB = () => {
    const mongoUrl = "mongodb://localhost:27017/";
    mongoose
        .connect(mongoUrl, {
        dbName: "MERN-Ecommerce",
    })
        .then((c) => console.log(`DB connected to ${mongoUrl}`))
        .catch((e) => console.log(e));
};
export const invalidateCache = async ({ product, order, admin, userId, orderId, productId }) => {
    if (product) {
        const productKeys = [
            "latest-product",
            "all-product",
            "categories", `product-${productId}`
        ];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        if (typeof productId === "object") {
            productId.forEach((i) => productKeys.push(`product-${i}`));
        }
        myCache.del(productKeys);
    }
    if (order) {
        const orderKeys = [
            "all-orders", `my-orders-${userId}`, `order-${orderId}`
        ];
        myCache.del(orderKeys);
    }
    if (admin) {
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await ProductModel.findById(order.productId);
        if (!product)
            throw new Error("Product Not Found");
        product.stock -= order.quantity;
        await product.save();
    }
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percent = ((thisMonth - lastMonth) / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
