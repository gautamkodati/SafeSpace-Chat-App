import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Space = () => {
    const [serverName, setServerName] = useState("")
        const navigate = useNavigate()
        const [servers, setServers] = useState([])
        useEffect(() => {
            const fetchServers = async () => {
                    const res = await fetch(`/api/disc/svall`)
                    const data = await res.json()
                    setServers(data)
                    // console.log("Servers list:", data)
            }
            fetchServers()
        }, [])

        const createServer = async ({ serverName }) => {
            try {
                const response = await fetch("/api/disc/createsv", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ serverName }),
                  });
              
                  const data = await response.json()
                  const serverId = data.serverId
                  // console.log("Server created:", data, "here is id", serverId)
    
                  if (response.ok) {
                    navigate('/planets', { state: { serverId } })
                  } else {
                    console.error("Error creating server:", data.error);
                  }
            } catch (error) {
                console.error("Error creating server:", error)   
            }
        }

        const handleSubmit = (e) => {
            e.preventDefault()
            createServer({ serverName })
        }
  return (
    <div className="main-container bg-[#a7d2cb] text-[#feffff] flex items-center h-[100vh]">
      <div className="left-container flex flex-col items-end lg:w-1/2 p-14">
        <div className="server-list flex flex-col h-80 w-100 items-center overflow-auto rounded-lg border-4 bg-[#fa7c92] border-[#fa7c92]">
          {/* {SERVERS.map((server) => (
                <Server key={server.id} server={server} />
              ))} */}

        {servers.map((server) => (
            <div key={server.id} className="font-semibold text-[#ffffff] bg-[#eeb6b7] text-center w-full border-[#fa7c92] border-2 py-2.5">
                <Link to={'/planets'} state={{ serverId: server.id }}>{server.serverName}</Link>
            </div>
            ))}

        </div>
      </div>
      <div className="right-container lg:w-1/2 flex flex-col items-start">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-[#f53240] mb-2.5">Build Your Safe Space</h1>
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <input className="border-3 rounded-sm text-start py-2 mb-3 text-sm text-[#22252c] border-[#c06014] pl-2 outline-none" type="text" placeholder="Enter Category Name..." onChange={(e) => setServerName(e.target.value)} value={serverName} required />
                <button className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" type="submit">Create Category</button>
            </form>
            {/* <div className="flex flex-col items-center">
                <p className="text-sm">{"Don't"} have an account?</p>
                <Link to='/signup'>
                    <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-2 dark:bg-green-600 dark:hover:bg-green-700">Sign Up</button>
                </Link>
            </div> */}
        </div>
      </div>
    </div>
  )
}

export default Space