import { useState } from "react";
import { useUserStore } from "../../store/store"
import axios from "axios";

export function Welcome() {
  const {id,name}= useUserStore((state) => state)
  const setUser = useUserStore((state) => state.setUser);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("")


    const callUser = async (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}/user/login`,
          {email,password},
          {withCredentials:true}
        );
        const data = response.data;
        setUser(data.userInfo);
        alert('Login Succesfull')
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }


  if(!id) {
    return <div className="flex items-center justify-center h-screen">
         <form onSubmit={(e)=>callUser(e)} className="flex flex-col gap-5">
          <input type="email" value={email} placeholder="enter email" onChange={(e)=>setEmail(e.target.value)} />
          <input type="text" value={password} placeholder="enter password" onChange={(e)=>setPassword(e.target.value)} />
          <button type="submit"> Login </button>
         </form>
    </div>
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      
      <h1 className="text-4xl font-bold mb-4">Welcome to
        the Application!{name}</h1>
      <p className="text-lg">This is a simple welcome page.</p>
      <p className="text-lg">You can customize this page as needed.</p>
    </div>
  )
}