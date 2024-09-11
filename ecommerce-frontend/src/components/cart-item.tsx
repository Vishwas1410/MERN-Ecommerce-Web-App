
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

type CartItemProps={
    cartItem:CartItem
    increamentHandler:(cartItem:CartItem)=>void;
    decreamentHandler:(cartItem:CartItem)=>void;
    removeHandler:(id:string)=>void;
}
const CartItemCard = ({cartItem,increamentHandler,decreamentHandler,removeHandler}:CartItemProps) => {

const {     photo ,
    productId ,
   
    quantity ,
    name ,
    price ,} = cartItem;
  return (

    

    <div className="cart-item">
        
        <img src={`${server}/${photo}`} alt={name} />
        <article>
            <Link to={`/product/${productId}`}>{name}</Link>
            <span> ₹{price}</span>
        </article>
        <div>
          <button onClick={()=>decreamentHandler(cartItem)}>-</button>
          <p>
            {quantity}
          </p>
          <button onClick={()=>increamentHandler(cartItem)}>+</button>
        </div>

    <button onClick={()=>removeHandler(productId)}><FaTrash/></button>



    </div>
  )
}

export default CartItemCard;