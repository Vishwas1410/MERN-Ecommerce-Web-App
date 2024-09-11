import { error } from "console";
import mongoose, { Document } from "mongoose";
import { InvalidateCacheProps, orderItemType } from "../types/types.js";
import { myCache } from "../app.js";
import { ProductModel } from "../models/productmodel.js";
import { OrderModel } from "../models/ordermodel.js";

export const connectDB = (mongoUrl:string) => {
  mongoose
    .connect(mongoUrl, {
      dbName: "MERN-Ecommerce",
    })
    .then((c) => console.log(`DB connected to ${mongoUrl}`))
    .catch((e) => console.log(e));
};
export const invalidateCache =  ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-product",
      "all-product",
      "categories",
      `product-${productId}`,
    ];
    if (typeof productId === "string") productKeys.push(`product-${productId}`);
    if (typeof productId === "object") {
      productId.forEach((i) => productKeys.push(`product-${i}`));
    }

    myCache.del(productKeys);
  }
  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];

    myCache.del(orderKeys);
  }
  if (admin) {
    myCache.del([
      "admin-stats",
      "admin-pie-chart",
      "admin-bar-charts",
      "admin-line-charts",
    ]);
  }
};

export const reduceStock = async (orderItems: orderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await ProductModel.findById(order.productId);
    if (!product) throw new Error("Product Not Found");
    product.stock -= order.quantity;
    await product.save();
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = (thisMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getCategories = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  const categoryCountPromise = categories.map((category) =>
    ProductModel.countDocuments({ category })
  );
  const categoriesCount = await Promise.all(categoryCountPromise);
  const categoryCount: Record<string, number>[] = [];
  categories.forEach((category, i) =>
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    })
  );
  return categoryCount;
};
export interface MyDocument extends Document {
  createdAt: Date;
  discount?: number;
  total?: number;
}
type FuncProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};
export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: FuncProps) => {
  const data = new Array(length).fill(0);
  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
    if (monthDiff < length) {
      data[length - monthDiff - 1] += property ? i[property]! : 1;
    }
  });
  return data;
};
