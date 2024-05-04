import { ReactElement, useState } from "react";
import TableHOC from "../components/admin/TableHOC"
import { Column } from "react-table";
import { Link } from "react-router-dom";
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