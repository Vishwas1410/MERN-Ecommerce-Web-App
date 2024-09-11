import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

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
  
  return (
    <div className="product-card">
        <img src={`${server}/${photo}`} alt={name} />
        <p>
            {name}
        </p>
        <span>
        ₹{price}
        </span>

        <div>
            <button onClick={()=>handler({productId,price,name,photo,stock,quantity:1})}>
            <FaPlus/>
            </button>
        </div>
    </div>
  )
}

export default ProductCard