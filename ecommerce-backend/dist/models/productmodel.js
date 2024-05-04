import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"]
    },
    photo: {
        type: String,
        required: [true, "Please add Photo"]
    },
    price: {
        type: Number,
        required: [true, "Please add Price"]
    },
    stock: {
        type: Number,
        required: [true, "Please add Stock"]
    },
    category: {
        type: String,
        required: [true, "Please Enter Category"],
        trim: true
    },
}, {
    timestamps: true
});
export const ProductModel = mongoose.model("Product", schema);
