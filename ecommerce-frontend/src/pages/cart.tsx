import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import cartItem from "../components/cart-item";
import CartItem from "../components/cart-item";
import { Link } from "react-router-dom";
const subtotal= 4000;
const cartItems = [{
  productId:"632874", photo:"https://m.media-amazon.com/images/I/41cgBFdKbfL._SY445_SX342_QL70_FMwebp_.jpg", name:"laptop", price:2000, quantity:4 , stock:10
  

}];
const tax = Math.round(subtotal*0.18)
const shippingCharges = 200
const discount = 200
const total = subtotal + tax + shippingCharges;

const Cart = () => {

const [couponCode , setCouponCode] = useState<string>("");
const [isValidCouponCode , setIsValisCouponCode] = useState<boolean>(false);

useEffect(() => {
  const timeOutId = setTimeout(() => {
    if (Math.random()> 0.5) setIsValisCouponCode(true)
    else setIsValisCouponCode(false)
  }, 1000);

  return () => {
    clearTimeout(timeOutId)
    setIsValisCouponCode(false)
  }
}, [couponCode])


  return (
    <div className="cart">
      <main>
      {cartItems.length > 0 ?(
        cartItems.map((i,idx)=>(<CartItem key={idx} cartItem={i}/>))
      ) : (<h1>No Items Added</h1>)}
      </main>
      <aside>

        <p>
          Subtotal:  ₹{subtotal}
        </p>
        <p>
          Shipping Charges:  ₹{shippingCharges}
        </p>
        <p>
          Tax:  ₹{tax}
        </p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b>Total:  ₹{total}</b>
        </p>
        <input type="text" value={couponCode} placeholder="Coupen Code" onChange={e=>setCouponCode(e.target.value)} />

        {
          couponCode && (          isValidCouponCode ? <span className="green"> ₹{discount} off using the <code>{couponCode}</code></span> : <span className="red">Invalid Coupon <VscError/></span>
        )
        }

        {
          cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>
        }

      </aside>
    </div>
  )
}

export default Cart