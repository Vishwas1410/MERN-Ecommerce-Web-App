import { TryCatch } from "../middlewares/error.js";
import { ProductModel } from "../models/productmodel.js";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    await ProductModel.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo?.path
    });
    return res.status(200).json({ success: true, message: "Product Created" });
});
