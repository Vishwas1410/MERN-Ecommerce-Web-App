import { TryCatch } from "../middlewares/error.js";
import { OrderModel } from "../models/ordermodel.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import errorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
export const myOrder = TryCatch(async (req, res, next) => {
    const { id: user } = req.query;
    let orders = [];
    if (myCache.has(`my-orders-${user}`))
        orders = JSON.parse(myCache.get(`my-orders-${user}`));
    else {
        orders = await OrderModel.find({ user });
        myCache.set(`my-orders-${user}`, JSON.stringify(orders));
    }
    return res.status(200).json({ success: true, orders });
});
export const getSingleOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    let order;
    if (myCache.has(`order-${id}`))
        order = JSON.parse(myCache.get(`order-${id}`));
    else {
        order = await OrderModel.findById(id).populate("user", "name");
        if (!order)
            return next(new errorHandler("Order Not Found", 404));
        myCache.set(`order-${id}`, JSON.stringify(order));
    }
    return res.status(200).json({ success: true, order });
});
export const deleteOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await OrderModel.findById(id);
    if (!order)
        return next(new errorHandler("Order Not Found", 404));
    await OrderModel.deleteOne();
    invalidateCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id),
    });
    return res
        .status(200)
        .json({ success: true, message: "Order Deleted Successfully" });
});
export const allOrders = TryCatch(async (req, res, next) => {
    const key = `all-orders`;
    let orders = [];
    if (myCache.has(key))
        orders = JSON.parse(myCache.get(key));
    else {
        orders = await OrderModel.find().populate("user", "name");
        myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
});
export const newOrder = TryCatch(async (req, res, next) => {
    const { shippingInfo, orderItems, user, tax, total, discount, subtotal, shippingCharges, } = req.body;
    if (!shippingInfo || !orderItems || !user || !tax || !total || !subtotal)
        return next(new errorHandler("Please Enter All Fields", 400));
    const order = await OrderModel.create({
        shippingInfo,
        orderItems,
        user,
        tax,
        total,
        discount,
        subtotal,
        shippingCharges,
    });
    await reduceStock(orderItems);
    await invalidateCache({
        product: true,
        order: true,
        admin: true,
        userId: user,
        productId: order.orderItems.map(i => String(i.productId))
    });
    return res
        .status(201)
        .json({ success: true, message: "Order Placed Successfully" });
});
export const processOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await OrderModel.findById(id);
    if (!order)
        return next(new errorHandler("Order Not Find", 404));
    switch (order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
    }
    await order.save();
    invalidateCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id),
    });
    return res
        .status(200)
        .json({ success: true, message: "Order Processed Successfully" });
});
