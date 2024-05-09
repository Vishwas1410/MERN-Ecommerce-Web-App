import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { OrderModel } from "../models/ordermodel.js";
import { ProductModel } from "../models/productmodel.js";
import { UserModel } from "../models/usermodel.js";
import { calculatePercentage } from "../utils/features.js";
export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats = {};
    if (myCache.has("admin-stats"))
        stats = JSON.parse(myCache.get("admin-stats"));
    else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
        };
        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth() - 1, 0),
        };
        const thisMonthProductPromise = ProductModel.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        const lastMonthProductPromise = ProductModel.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        const thisMonthUserPromise = UserModel.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        const lastMonthUserPromise = UserModel.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        const thisMonthOrdersPromise = OrderModel.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        const lastMonthOrdersPromise = OrderModel.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        const lastSixMonthOrdersPromise = OrderModel.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today
            },
        });
        const latestTransactionsPromise = OrderModel.find({}).select(["orderItems", "discount", "total", "status"]).limit(4);
        const [thisMonthOrders, thisMonthProducts, thisMonthUsers, lastMonthOrders, lastMonthProducts, lastMonthUsers, productsCount, usersCount, allOrders, lastSixMonthOrders, categories, femaleUsersCount, latestTransactions] = await Promise.all([
            thisMonthOrdersPromise,
            thisMonthProductPromise,
            thisMonthUserPromise,
            lastMonthOrdersPromise,
            lastMonthProductPromise,
            lastMonthUserPromise,
            ProductModel.countDocuments(),
            UserModel.countDocuments(),
            OrderModel.find({}).select("total"),
            lastSixMonthOrdersPromise,
            ProductModel.distinct("category"),
            UserModel.countDocuments({ gender: "female" }),
            latestTransactionsPromise
        ]);
        const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const changePercent = {
            revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            users: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
            product: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
            orders: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length)
        };
        const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 0);
        const count = {
            revenue: revenue,
            product: productsCount,
            user: usersCount,
            order: allOrders.length,
        };
        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthRevenue = new Array(6).fill(0);
        lastSixMonthOrders.forEach((order) => {
            const creationDate = order.createdAt;
            const monthDiff = today.getMonth() - creationDate.getMonth();
            if (monthDiff < 6) {
                orderMonthCounts[6 - monthDiff - 1] += 1;
                orderMonthRevenue[6 - monthDiff - 1] += order.total;
            }
        });
        const categoryCountPromise = categories.map((category) => ProductModel.countDocuments({ category }));
        const categoriesCount = await Promise.all(categoryCountPromise);
        const categoryCount = [];
        categories.forEach((category, i) => categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productsCount) * 100)
        }));
        const userRatio = {
            male: usersCount - femaleUsersCount,
            female: femaleUsersCount
        };
        const modifiedLatestTransactions = latestTransactions.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status
        }));
        stats = {
            categoryCount,
            changePercent,
            count,
            chart: {
                order: orderMonthCounts,
                revenue: orderMonthRevenue
            },
            userRatio,
            latestTransactions: modifiedLatestTransactions
        };
        myCache.set("admin-stats", JSON.stringify(stats));
    }
    res.status(200).json({ success: true, stats });
});
export const getPieCharts = TryCatch(async () => { });
export const getBarCharts = TryCatch(async () => { });
export const getLineCharts = TryCatch(async () => { });
