import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../components/cart-item";
import {
  addToCart,
  applyDiscount,
  calculatePrice,
  removeCartItems,
} from "../redux/reducer/cartReducer";
import { cartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import axios from "axios";
import { server } from "../redux/store";

const Cart = () => {
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: cartReducerInitialState }) => state.cartReducer
    );

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValisCouponCode] = useState<boolean>(false);
  const dispatch = useDispatch();
  const increamentHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;
    if (cartItem.stock < 1) return toast.error("out of stock");
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decreamentHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 0) return;

    if (cartItem.stock < 1) return toast.error("out of stock");
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (productId: string) => {
    dispatch(removeCartItems(productId));
  };

  useEffect(() => {
    const { token, cancel } = axios.CancelToken.source();

    const timeOutId = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
          cancelToken: token,
        })
        .then((res) => {
          // console.log(res.data.discount);

          dispatch(applyDiscount(res.data.discount));

          setIsValisCouponCode(true);
          dispatch(calculatePrice());
        })
        .catch(() => {
          dispatch(applyDiscount(0));
          cancel();
          dispatch(calculatePrice());
          setIsValisCouponCode(false);
        });
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
      setIsValisCouponCode(false);
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, idx) => (
            <CartItemCard
              key={idx}
              increamentHandler={increamentHandler}
              removeHandler={removeHandler}
              decreamentHandler={decreamentHandler}
              cartItem={i}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      {cartItems.length > 0 && (
        <aside>
          <p>Subtotal: ₹{subtotal}</p>
          <p>Shipping Charges: ₹{shippingCharges}</p>
          <p>Tax: ₹{tax}</p>
          <p>
            Discount: <em className="red">- ₹{subtotal > 0 ? discount : 0}</em>
          </p>
          <p>
            <b>Total: ₹{total}</b>
          </p>
          <input
            type="text"
            value={couponCode}
            placeholder="Coupen Code"
            onChange={(e) => setCouponCode(e.target.value)}
          />

          {subtotal > 0
            ? couponCode &&
              (isValidCouponCode ? (
                <span className="green">
                  {" "}
                  ₹{discount} off using the <code>{couponCode}</code>
                </span>
              ) : (
                <span className="red">
                  Invalid Coupon <VscError />
                </span>
              ))
            : couponCode && (
                <span className="red">
                  Please Add Items In Cart to apply coupon <VscError />
                </span>
              )}

          {cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>}
        </aside>
      )}
    </div>
  );
};

export default Cart;
