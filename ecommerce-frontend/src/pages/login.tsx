import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import toast from 'react-hot-toast';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";

const Login = () => {

    const [gender,setGender] =useState("")
    const [date,setDate] =useState("")

    const [login] = useLoginMutation()

    const loginHandler =async() =>{
        try {
            const provider = new GoogleAuthProvider();
            const {user} = await signInWithPopup(auth,provider);

           const res =  await login({
                name: user.displayName!,
                email:user.email!,
                dob:date,
                _id:user.uid,
                role: "user",
                gender,
                photo: user.photoURL!,

            });
            if("data" in res){

                toast.success(res.data!.message)


            }
            else{
                const error = res.error as FetchBaseQueryError
                const message  = (error.data as MessageResponse).message
                toast.error(message)   
            }
            console.log(user);
            
        } catch (error) {
            toast.error("Sign In Fail")
        }
    }
  return (
    <div className="login">
        <main>
            <h1 className="heading">
                Login
            </h1>
                <div>
                    <label >Gender</label>
                    <select name="gender" value={gender} onChange={(e)=>setGender(e.target.value)} >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label >Date Of Birth</label>
                    
                    <input value={date} type="date" onChange={e=>setDate(e.target.value)} />
                </div>
                <div>
                    <p>
                        Already Signed In Once
                    </p>
                    <button onClick={loginHandler}><FcGoogle/><span>Sign in with google</span></button>
                </div>

            
        </main>
    </div>
  )
}

export default Login