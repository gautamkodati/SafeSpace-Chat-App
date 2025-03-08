import { Link } from "react-router-dom"
import { useState } from "react"
import { useMutation, useQueryClient } from '@tanstack/react-query'

const LoginPage = () => {
const [formData, setFormData] = useState({
        username: "",
        password: "",
      });
    const queryClient = useQueryClient()

    const { mutate:loginMutation, isError, isPending, error } = useMutation({
        mutationFn: async ({username, password}) => {
          try {
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, password })
            })
    
            const data = await res.json()
    
            if(!res.ok){
              throw new Error(data.error || "Something went wrong")
            }
          } catch (error) {
            throw new Error(error)
          }
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["authUser"] })
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation(formData)
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  return (
    <div className="bg-[#e38fa6] text-white flex items-center h-[100vh]">
        <div className="flex flex-col items-end lg:w-1/2 p-14">
            <div>
                <h1 className="text-4xl font-extrabold mb-1.5 text-[#fbe9d0]">Find your Space</h1>
                <p className="text-sm text-center text-[#024950]">Connect with others who understand.<br/>Share, support, and heal together in<br/>a safe and anonymous environment.</p>
            </div>
        </div>
        <div className="lg:w-1/2 flex flex-col items-start">
            <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-[#c5feef] mb-2.5">{"Let's"} go!</h1>
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <input className="border-3 rounded-sm text-start py-2 mb-3 text-sm text-[#ffffff] border-[#ffccbc] pl-2 outline-none" type="text" placeholder="Username" name="username" onChange={handleInputChange} value={formData.username} />      
                <input className="border-3 rounded-sm text-start py-2 mb-3 text-sm text-[#ffffff] border-[#ffccbc] pl-2 outline-none" type="password" placeholder="Password" name="password" onChange={handleInputChange} value={formData.password} />
                <button className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 text-center mt-2 mb-2" type="submit">{isPending ? "Loading..." : "Login"}</button>
                {isError && <p>{error.message}</p>}
            </form>
            <div className="flex flex-col items-center">
                <p className="text-sm text-[#024950]">{"Don't"} have an account?</p>
                <Link to='/signup'>
                    <button className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 text-center mt-2 mb-2">Sign Up</button>
                </Link>
            </div>
        </div>
        </div>
    </div>
  )
}

export default LoginPage