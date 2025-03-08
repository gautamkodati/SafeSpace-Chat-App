import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from "react-hot-toast";

const SignUpPage = () => {

  const [formData, setFormData] = useState({
    // email: "",
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    // gender: "",
  })

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async({fullName, username, password, confirmPassword, gender}) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({fullName, username, password, confirmPassword, gender})
        })

        const data = await res.json()
        if(!res.ok) throw new Error(data.error || "Failed to create account")
        console.log(data)
        return data
      } catch (error) {
        throw error
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData)
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            <h1 className="text-3xl font-bold text-[#c5feef] mb-2.5">Join today</h1>
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <input className="border-3 rounded-sm text-start py-2 mb-3 text-sm text-[#ffffff] border-[#ffccbc] pl-2 outline-none" type="text" placeholder="Username" name="username" onChange={handleInputChange} value={formData.username} />
                <input className="border-3 rounded-sm text-start py-2 mb-3 text-sm text-[#ffffff] border-[#ffccbc] pl-2 outline-none" type="text" placeholder="Full Name" name="fullName" onChange={handleInputChange} value={formData.fullName} />
                <input className="border-3 rounded-sm text-start py-2 mb-3 text-sm text-[#ffffff] border-[#ffccbc] pl-2 outline-none" type="password" placeholder="Password" name="password" onChange={handleInputChange} value={formData.password} />
                <input className="border-3 rounded-sm text-start py-2 mb-3 text-sm text-[#ffffff] border-[#ffccbc] pl-2 outline-none" type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleInputChange} value={formData.confirmPassword} />
                {/* <input type="text" placeholder="Gender" name="gender" onChange={handleInputChange} value={formData.gender} /> */}
                <button className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 text-center mt-2 mb-2" type="submit">{isPending ? "Loading..." : "Sign up"}</button>
                {isError && <p>{error.message}</p>}
            </form>
            <div className="flex flex-col items-center">
                <p className="text-sm text-[#024950]">Already have an account?</p>
                <Link to='/login'>
                    <button className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 text-center mt-2 mb-2">Log In</button>
                </Link>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage