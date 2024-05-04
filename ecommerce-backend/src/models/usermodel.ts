import mongoose from "mongoose";
import validator from "validator";


interface IUser extends Document{
    _id: string;
    name: string;
    email: string;
    photo: string;
    role: "admin" | "user";
    gender: "female" | "male";
    dob: Date;
    createdAt: Date;
    updatedAt: Date;
    age: number; //virtual attribute

}
const schema = new mongoose.Schema({
    _id:{
        type: String,
        required: [true , "Please Enter ID"]
    },
    
    name:{
        type: String,
        required: [true, "Please Enter Name"]
    },
    email:{
        type: String,
        unique: [true," Email Alreay exists"],
        required: [true, "Please Enter Name"],
        validate:validator.default.isEmail,
    },
    photo:{
        type: String,
        required: [true, "Please add Photo"]
    },
    role:{
        default:"user",
        type: String,
        enum: ["admin" , "user"]
    },
    gender:{
        required: [true, "Please Enter Your Gender"],
        type: String,
        enum: ["female" , "male"]
    },
    dob:{
        required: [true, "Please Enter Your Date of birth"],
        type: Date,
        
        
    },
    

},{
    timestamps: true
});

schema.virtual("age").get(function(){
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if(today.getMonth() < dob.getMonth() || today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate() )
        {
            age--;
        }  
        return age;
})

export const UserModel  = mongoose.model("User", schema);