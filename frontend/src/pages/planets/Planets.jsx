import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"

const Planets = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { serverId } = location.state || {}
    const [discussionName, setDiscussionName] = useState("")
    const [discussions, setDiscussions] = useState([])
    
    useEffect(() => {
        const fetchDiscussions = async () => {
                const res = await fetch(`/api/disc/discussionsall/${serverId}`)
                const data = await res.json()
                setDiscussions(data)
                // console.log("Discussion list:", data, "here is sv id", serverId)
        }
        fetchDiscussions()
    }, [serverId])

    const createDiscussion = async ({ discussionName }) => {
        try {
            const response = await fetch(`api/disc/makedisc/${serverId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ discussionName }),
            })

            const data = await response.json()
            const discId = data.id
            const discName = data.discussionName
            // console.log("created disc id=", discId)

            if(response.ok) {
                navigate('/chatroom', { state: { discId, roomId: discName } })
            } else {
                console.error("Error creating discussion:", data.error)
            }
        } catch (error) {
            console.error("Error creating discussion:", error)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        createDiscussion({ discussionName })
    }

  return (
    <div className="main-container bg-[#efd9c1] text-white flex items-center h-[100vh]">
      <div className="left-container flex flex-col items-end lg:w-1/2 p-14">
        <div className="server-list flex flex-col h-80 w-100 items-center overflow-auto rounded-lg border-4 bg-[#dabcfc] border-[#bc85fa]">

        {discussions.map((discussion) => (
            <div key={discussion.id} className="font-semibold bg-[#dabcfc] text-[#ffffff] text-center w-full border-[#bc85fa] border-2 py-2.5">
                <Link to={'/chatroom'} state={{ discId: discussion.id, roomId: discussion.discussionName }}>{discussion.discussionName}</Link>
            </div>
        ))}

        </div>
      </div>
      <div className="right-container lg:w-1/2 flex flex-col items-start">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-[#8927f6] mb-2.5">Begin Discussing</h1>
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <input className="border-3 rounded-sm text-start py-2 mb-3 text-sm text-[#3a0475] border-[#7009e3] pl-2 outline-none" type="text" placeholder="Enter Discussion Name..." onChange={(e) => setDiscussionName(e.target.value)} value={discussionName} required />
                <button className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" type="submit">Create Discussion</button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default Planets