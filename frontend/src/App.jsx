import SignUpPage from "./pages/auth/signup/SignUpPage"
import LoginPage from "./pages/auth/login/LoginPage"
import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'
import ChatRoom from "./pages/chat/ChatRoom";
import { io } from "socket.io-client"
import { useEffect } from "react";
import Space from "./pages/space/Space";
import Planets from "./pages/planets/Planets";

const socket  = io("http://localhost:5000")

function App() {

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connection has been established")
    })

    return () => {
      socket.off("connect")
    }
  }, [])

  const { data:authUser, isLoading } = useQuery({
    // we use queryKey to give a unique name to our query and refer to it later
    queryKey: ['authUser'],
    queryFn: async() => {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        if(data.error) return null // this is when the user is not authenticated
        if(!res.ok){
          throw new Error(data.error || "Something went wrong")
        }
        return data
      } catch (error) {
        throw new Error(error)
      }
    },
    retry: false
  })

  if(isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div>
      <Routes>
        
        <Route path='/' element={authUser ? <Space /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        {/* <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/choose' element={authUser ? <ChoosePage /> : <Navigate to="/login" />} />
        <Route path='/create' element={authUser ? <CreatePage socket={socket} /> : <Navigate to="/login" />} />
        <Route path='/svmake' element={authUser ? <MakeServer socket={socket} /> : <Navigate to="/login" />} />
        <Route path='/discussions/:serverId' element={authUser ? <DiscussionList /> : <Navigate to="/login" />} />
        <Route path='/lounge' element={authUser ? <ServerList /> : <Navigate to="/login" />} /> */}
        <Route path='/chatroom' element={authUser ? <ChatRoom socket={socket} /> : <Navigate to="/login" />} />
        <Route path='/planets' element={authUser ? <Planets /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App