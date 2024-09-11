import { ReactElement, useState } from "react";
import TableHOC from "../components/admin/TableHOC"
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userReducerInitialState } from "../types/reducer-types";
import { useAllOrdersQuery } from "../redux/api/orderAPI";
import toast from "react-hot-toast";
import { customError } from "../types/api-types";
  type DataType = {
    _id: string;
    quantity: number;
    amount: number;
    discount:number;
    status: ReactElement;
    action: ReactElement
  };
  const column: Column<DataType>[]= [{
    Header: 'ID',
    accessor: '_id'
  },{
    Header: 'Quantity',
    accessor: "quantity"
},
{
    Header: 'Discount',
    accessor: 'discount'
},
{
  Header: 'Amount',
  accessor:'amount'
},
{
    Header: 'Status',
    accessor: 'status'
  },{
    Header: 'Action',
    accessor: 'action'
  },]
const Orders = () => {

  const { user } = useSelector(
    (state:{userReducer:userReducerInitialState}) =>state.userReducer
  );

  
  const { isError, error, isLoading, data } = useAllOrdersQuery(user?._id!);


  if(isError){
    const err = error as customError;
    return toast.error(err.data.message);
  }


        const [rows ] = useState<DataType[]>([{
            _id: "dsfab",
    quantity: 23 ,
    amount: 32519 ,
    discount:5462,
    status: <span className="red">Processing</span>,
    action: <Link to={`/order/dsfab`}>View</Link>,
        }])

    const table = TableHOC<DataType>( column,rows,"dashboard-product-box" ,"orders", rows.length > 6 )();
  return (
    <div className="container">
        <h1>
            My Orders
            {table}
        </h1>
    </div>
  )
}

export default Orders