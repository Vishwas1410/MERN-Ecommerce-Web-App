import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { OrderModel } from "../models/ordermodel.js";
import { ProductModel } from "../models/productmodel.js";
import { UserModel } from "../models/usermodel.js";
import { calculatePercentage, getCategories, getChartData } from "../utils/features.js";
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
                $lte: today,
            },
        });
        const latestTransactionsPromise = OrderModel.find({})
            .select(["orderItems", "discount", "total", "status"])
            .limit(4);
        const [thisMonthOrders, thisMonthProducts, thisMonthUsers, lastMonthOrders, lastMonthProducts, lastMonthUsers, productsCount, usersCount, allOrders, lastSixMonthOrders, categories, femaleUsersCount, latestTransactions,] = await Promise.all([
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
            latestTransactionsPromise,
        ]);
        const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const changePercent = {
            revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            users: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
            product: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
            orders: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
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
            const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
            if (monthDiff < 6) {
                orderMonthCounts[6 - monthDiff - 1] += 1;
                orderMonthRevenue[6 - monthDiff - 1] += order.total;
            }
        });
        const categoryCount = await getCategories({ categories, productsCount });
        const userRatio = {
            male: usersCount - femaleUsersCount,
            female: femaleUsersCount,
        };
        const modifiedLatestTransactions = latestTransactions.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status,
        }));
        stats = {
            categoryCount,
            changePercent,
            count,
            chart: {
                order: orderMonthCounts,
                revenue: orderMonthRevenue,
            },
            userRatio,
            latestTransactions: modifiedLatestTransactions,
        };
        myCache.set("admin-stats", JSON.stringify(stats));
    }
    res.status(200).json({ success: true, stats });
});
export const getPieCharts = TryCatch(async (req, res, next) => {
    let charts;
    if (myCache.has("admin-pie-chart"))
        charts = JSON.parse(myCache.get("admin-pie-chart"));
    else {
        const allOrderPromise = OrderModel.find({}).select([
            "total",
            "discount",
            "tax",
            "shippingCharges",
        ]);
        const [ProcessingOrder, ShippedOrder, DeliveredOrder, categories, productsCount, productOutOfStock, allOrders, allUsers, customerUsers, adminUsers,] = await Promise.all([
            OrderModel.countDocuments({ status: "Processing" }),
            OrderModel.countDocuments({ status: "Shipped" }),
            OrderModel.countDocuments({ status: "Delivered" }),
            ProductModel.distinct("category"),
            ProductModel.countDocuments(),
            ProductModel.countDocuments({ stock: 0 }),
            allOrderPromise,
            UserModel.find({}).select(["dob"]),
            UserModel.countDocuments({ role: "user" }),
            UserModel.countDocuments({ role: "admin" }),
        ]);
        const orderFullfillment = {
            processing: ProcessingOrder,
            shipped: ShippedOrder,
            delivered: DeliveredOrder,
        };
        const productCategories = await getCategories({
            categories,
            productsCount,
        });
        const stockAvailability = {
            inStock: productsCount - productOutOfStock,
            OutOfStock: productOutOfStock,
        };
        const grossIncome = allOrders.reduce((prev, order) => prev + (order.total || 0), 0);
        const discount = allOrders.reduce((prev, order) => prev + (order.discount || 0), 0);
        const productionCost = allOrders.reduce((prev, order) => prev + (order.shippingCharges || 0), 0);
        const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
        const marketingCost = Math.round(grossIncome * (30 / 100));
        const netMargin = grossIncome - discount - burnt - productionCost - marketingCost;
        const revenueDistribution = {
            netMargin,
            discount,
            productionCost,
            burnt,
            marketingCost,
        };
        const adminCustomer = {
            admin: adminUsers,
            customers: customerUsers,
        };
        const usersAgeGroup = {
            teen: allUsers.filter((i) => i.age < 20).length,
            adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
            old: allUsers.filter((i) => i.age >= 40).length,
        };
        charts = {
            orderFullfillment,
            productCategories,
            stockAvailability,
            revenueDistribution,
            adminCustomer,
            usersAgeGroup,
        };
        myCache.set("admin-pie-chart", JSON.stringify(charts));
    }
    return res.status(200).json({ success: true, charts });
});
export const getBarCharts = TryCatch(async (req, res, next) => {
    const key = "admin-bar-charts";
    let charts;
    if (myCache.has(key))
        charts = JSON.parse(myCache.get(key));
    else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const sixMonthProductPromise = ProductModel.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            },
        }).select("createdAt");
        const sixMonthUsersPromise = UserModel.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            },
        }).select("createdAt");
        const twelveMonthOrdersPromise = OrderModel.find({
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today,
            },
        }).select("createdAt");
        const [products, users, orders] = await Promise.all([
            sixMonthProductPromise,
            sixMonthUsersPromise,
            twelveMonthOrdersPromise,
        ]);
        const productCount = getChartData({
            length: 6,
            today,
            docArr: products
        });
        const userCount = getChartData({
            length: 6,
            today,
            docArr: users
        });
        const orderCount = getChartData({
            length: 12,
            today,
            docArr: orders
        });
        charts = {
            orders: orderCount,
            users: userCount,
            products: productCount
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({ success: true, charts });
});
export const getLineCharts = TryCatch(async (req, res, next) => {
    const key = "admin-line-charts";
    let charts;
    if (myCache.has(key))
        charts = JSON.parse(myCache.get(key));
    else {
        const today = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const baseQuery = {
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today,
            },
        };
        const [products, users, orders] = await Promise.all([
            ProductModel.find(baseQuery).select("createdAt"),
            UserModel.find(baseQuery).select("createdAt"),
            OrderModel.find(baseQuery).select(["createdAt", "discount", "total"]),
        ]);
        const productCount = getChartData({
            length: 12,
            today,
            docArr: products
        });
        const userCount = getChartData({
            length: 12,
            today,
            docArr: users
        });
        const discount = getChartData({
            length: 12,
            today,
            docArr: orders,
            property: "discount"
        });
        const revenue = getChartData({
            length: 12,
            today,
            docArr: orders,
            property: "total"
        });
        charts = {
            discount,
            revenue,
            users: userCount,
            products: productCount
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({ success: true, charts });
});
