import { error } from "console"
import mongoose from "mongoose"

export const connectDB = ()=>{
    const mongoUrl ="mongodb://localhost:27017/"
    mongoose.connect(mongoUrl, {
        dbName:"MERN-Ecommerce"
    }).then((c)=>
        console.log(`DB connected to ${mongoUrl}`)
        
    ).catch((e)=>console.log(e)
    )
}