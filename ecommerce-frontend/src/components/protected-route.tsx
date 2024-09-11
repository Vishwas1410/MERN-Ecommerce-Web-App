import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface props{
    children?:ReactElement
    isAuthenticated:boolean;
    adminRoute?: boolean;
    isAdmin?: boolean;
    redirect?: string;
}
const ProtectedRoute = ({children,isAuthenticated,isAdmin,redirect="/",adminRoute}:props) => {
  if(!isAuthenticated) return <Navigate to={redirect}/>;
    
  if(adminRoute && !isAdmin) return <Navigate to={redirect}/>;




  return children?children : <Outlet/>;
}

export default ProtectedRoute