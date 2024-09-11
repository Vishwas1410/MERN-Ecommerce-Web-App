import { CartItem, ShippingInfo, User } from "./types";

export interface userReducerInitialState{
    user: User | null;
    loading: boolean;
}

export interface cartReducerInitialState{
    loading: boolean;
    cartItems: CartItem[];
    subtotal:number
    tax:number 
    total : number
    shippingCharges:number
    discount:number;
    shippingInfo:ShippingInfo;
}