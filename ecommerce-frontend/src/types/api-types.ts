import { CartItem, Order, Product, ShippingInfo, User } from "./types";

export type MessageResponse = {
    success: boolean;
    message: string;
}
export type UserResponse = {
    success: boolean;
    user: User;
}

export type AllProductsResponse ={
    success: boolean;
    products: Product[];
}
export type AllOrdersResponse ={
    success: boolean;
    orders: Order[];
}
export type OrderDetailResponse ={
    success: boolean;
    order: Order;
}

export type productDetailsResponse ={
    success: boolean;
    product: Product;
}
export type categoriesResponse ={
    success: boolean;
    categories: string[];
}
export type customError ={
    status: number;
    data: {
        message: string;
        success : boolean
    };
}


export type searchProductsResponse ={
    success: boolean;
    products: Product[];
    totalPage: number;
}
export type searchProductsRequest ={
    price: number;
    page: number;
    category: string;
    search: string;
    sort:string;
}
export type newProductRequest={
id:string;
formData:FormData
}
export type updateProductRequest={
userId:string;
productId:string
formData:FormData
}
export type DeleteProductRequest={
userId:string;
productId:string
}



export type NewOrderRequest={
    shippingInfo:ShippingInfo;
    orderItems: CartItem[];
    subtotal:number
    tax:number 
    total : number
    shippingCharges:number
    discount:number;
    user:string
    }

export type UpdateOrderRequest={
    UserId:string;
    orderId:string;
    }
