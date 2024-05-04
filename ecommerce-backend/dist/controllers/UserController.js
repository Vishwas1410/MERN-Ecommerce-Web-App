import { UserModel } from "../models/usermodel.js";
import errorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
export const newUser = TryCatch(async (req, res, next) => {
    const { name, email, photo, _id, dob, gender } = req.body;
    let user = await UserModel.findById(_id);
    if (user) {
        return res.status(200).json({ success: true, message: `Welcome ${user.name}` });
    }
    if (!name || !email || !photo || !_id || !dob || !gender) {
        return next(new errorHandler("Please Add All Feilds", 400));
    }
    user = await UserModel.create({
        name,
        email,
        photo,
        _id,
        dob,
        gender,
    });
    await user.save();
    return res
        .status(201)
        .json({ success: true, message: `welcome ${user.name}` });
});
export const getAllUsers = TryCatch(async (req, res, next) => {
    let users = await UserModel.find({});
    return res
        .status(200)
        .json({ success: true, users });
});
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    let user = await UserModel.findById(id);
    if (!user) {
        return next(new errorHandler("Invalid Id", 400));
    }
    return res
        .status(200)
        .json({ success: true, user });
});
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    let user = await UserModel.findById(id);
    if (!user) {
        return next(new errorHandler("Invalid Id", 400));
    }
    await UserModel.deleteOne();
    return res
        .status(200)
        .json({ success: true, message: "User Deleted Successfully" });
});
