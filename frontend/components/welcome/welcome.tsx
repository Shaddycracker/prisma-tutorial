import { useEffect } from "react"
import { useUserStore } from "../../store/store"
import axios from "axios";

export function Welcome() {
  const {id,name}= useUserStore((state) => state)
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {

    const callUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}/user`);
        const data = response.data;
        setUser(data);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    callUser();

  }, [])

  if(!id) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
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