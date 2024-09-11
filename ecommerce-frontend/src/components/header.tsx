import { useState } from "react"
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { User } from "../types/types"
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";


interface propsType{
    user: User | null;

}

const Header = ({user}:propsType) => {

    const [isOpen, setIsOpen] =useState<boolean>(false);

    
const logoutHandler= async ()=>{

    try {
        await signOut(auth);
        toast.success("Signed Out Successfully");
        setIsOpen(false)
    } catch (error) {
        toast.error("Sign Out Failed")
    }
}
  return (
    <nav className="header">
        <Link to={"/"} onClick={()=>setIsOpen((false))}>Home</Link>
        <Link to={"/search"} onClick={()=>setIsOpen((false))} ><FaSearch/></Link>
        <Link to={"/cart"} onClick={()=>setIsOpen((false))}><FaShoppingBag/></Link>


        {
            user?._id?(
                <><button onClick={()=>setIsOpen((prev)=>!prev)} ><FaUser/></button>
                <dialog open={isOpen}>
                    <div>
                        {user.role==="admin" &&(
                            <Link to={"/admin/dashboard"} onClick={()=>setIsOpen((false))}>Admin</Link>
                        )}

                        <Link to={"/orders"} onClick={()=>setIsOpen((false))}>Orders</Link>
                        <button onClickCapture={logoutHandler}><FaSignOutAlt/></button>
                    </div>
                </dialog>
                </>
            ): <Link to={"/login"} onClick={()=>setIsOpen((false))}><FaSignInAlt/></Link>

        }
    </nav>
  )
}

export default Header