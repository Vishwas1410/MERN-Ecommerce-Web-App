import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";
import { TbCameraSelfie } from "react-icons/tb";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import React, {useRef} from "react";
import { Link } from "react-router-dom";
type ProductProps={
productId: string;
photo: string;
name: string;
price: number;
stock: number;
handler:(cartItem: CartItem) => string | undefined
}
// const server = import.meta.env.VITE_SERVER;
const ProductCard = ({productId,price,name,photo,stock,handler,}:ProductProps) => {
  const cameraHandler= async () => {
  }
  return (
    <div className="product-card">
        <img src={`${server}/${photo}`} alt={name} />
        <p>
            {name}
        </p>
        <span>
        ₹{price}
        </span>
        <div className="cam">
        <Link to={"/viewProd"}>
          <button className="camera" onClick={cameraHandler} ><TbCameraSelfie />
        </button>
        </Link>
        </div>

        <div>
            <button className="add" onClick={()=>handler({productId,price,name,photo,stock,quantity:1})}>
            <FaPlus/>
            </button>
        </div>
    </div>
  )
}

export default ProductCard