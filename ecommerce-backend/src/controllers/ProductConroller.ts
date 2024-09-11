import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  IProductRequest,
  SearchRequestQuery,
} from "../types/types.js";
import { ProductModel } from "../models/productmodel.js";
import errorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { count } from "console";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, IProductRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo) {
      return next(new errorHandler("Please Upload Photo", 400));
    }
    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log("Deleted");
      });

      return next(new errorHandler("Please Enter All feilds ", 400));
    }
    const product = await ProductModel.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
    });
    invalidateCache({product:true,admin:true})
    return res.status(200).json({ success: true, message: "Product Created" });
  }
);

export const getLatestProducts = TryCatch(async (req, res, next) => {
  let products;
  if (myCache.has("latest-product"))
    products = JSON.parse(myCache.get("latest-product")!);
  else {
    products = await ProductModel.find({})
      .sort({
        createdAt: -1,
      })
      .limit(5);
    myCache.set("latest-product", JSON.stringify(products));
  }
  return res.status(200).json({ success: true, products });
});

export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;
  if (myCache.has("categories"))
    categories = JSON.parse(myCache.get("categories") as string);
  else {
    categories = await ProductModel.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }
  return res.status(200).json({ success: true, categories });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;
  if (myCache.has("all-product"))
    products = JSON.parse(myCache.get("all-product") as string);
  else {
    products = await ProductModel.find({});
    myCache.set("all-product", JSON.stringify(products));
  }
  return res.status(200).json({ success: true, products });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;
  if (myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await ProductModel.findById(id);

    if (!product) return next(new errorHandler("Product Not Found", 404));

    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) return next(new errorHandler("Product Not Found", 404));
  rm(product.photo, () => {
    console.log("Product Photo Deleted");
  });
  await product.deleteOne();

   invalidateCache({product:true, productId:String(product._id),admin: true})

  return res
    .status(200)
    .json({ success: true, message: "Product Deleted Successfully" });
});

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;

  const product = await ProductModel.findById(id);
  if (!product) return next(new errorHandler("Product not found", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log("Old Photo Deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (category) product.category = category;
  if (stock) product.stock = stock;
  if (price) product.price = price;

  await product.save();
  
  invalidateCache({product:true, productId:String(product._id),admin: true})


  return res
    .status(200)
    .json({ success: true, message: "Product Updated Sucessfully" });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };
    if (category) baseQuery.category = category;

    const productPromise = ProductModel.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);
    const [products, filteredOnlyProduct] = await Promise.all([
      productPromise,
      ProductModel.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(200).json({ success: true, products, totalPage });
  }
);
