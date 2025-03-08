import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ChatRoom.module.css"
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState } from "react";

const ChatRoom = ({ socket }) => {
    const navigate = useNavigate();
    const {data: authUser} = useQuery({queryKey: ["authUser"]})
    const username = authUser.username;
    const userId = authUser.id;
    const location = useLocation();
    const { roomId, discId } = location.state || {};

    const [currentMessage, setCurrentMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [dbmessages, setDbmessages] = useState([]);
    const [acivityMsg, setActivityMsg] = useState("")

    const handleInputChange = (e) => {
      const value = e.target.value
      setCurrentMessage(value)

      // emit the activity detection to the server
      socket.emit("user_typing", { username, discId })
    }

    useEffect(() => {
      // user typing detection

      let timer;


      socket.on("user_typing", (username) => {
        setActivityMsg(`${username} is typing...`)
        clearTimeout(timer)

        timer = setTimeout(() => {
          setActivityMsg("")
        }, 1000)
      })
      return () => {
        socket.off("user_typing")
      }
    })

    useEffect(() => {
      if (!discId || !username) return; // Prevent errors if roomId is missing

      // Rejoin the room after reconnecting
      socket.emit("user_join_room", { username, discId });

      const handleNewMessage = ({ username, text, type, discId }) => {
        const uuid = uuidv4()
        setMessages((prevMessages) => [...prevMessages, {
          id: uuid,
          username,
          text,
          type,
          discId
        }]);
      };
      // receiving messages from the server
      // socket.on("message", ({ username, text, type }) => {
      //   const uuid = uuidv4()
      //   setMessages(prevMessages => [...prevMessages, {
      //     id: uuid,
      //     username,
      //     text,
      //     type
      //   }])
      // })

      socket.on("message", handleNewMessage)

      return () => {
        socket.off("message", handleNewMessage)
      }
    }, [socket, discId, username])

    useEffect(() => {
      // notifying the current user that a user has joined the room
      socket.on("user_join_room", (message) => {
        const uuid = uuidv4()
        setMessages(prev => [...prev, {
          id: uuid,
          type: "notif",
          text: message
        }])
      })

      return () => {
        socket.off("user_join_room")
      }
    }, [socket])

    // useEffect(() => {

    //   // notifying users that the current user left

    //   const handleBeforeUnload = (e) => {
    //     socket.emit("user_left_room", { username, roomId })
    //   }

    //   window.addEventListener("beforeunload", handleBeforeUnload)

    //   return () => {
    //     window.removeEventListener("beforeunload", handleBeforeUnload)
    //   }
    // }, [username, roomId])

    // useEffect(() => {
    //   socket.on("message", (newMessage) => {
    //     setMessages((prevMessages) => [...prevMessages, newMessage])
    //   })

    //   return () => socket.off("message", handleNewMessage)
    // }, [socket])

    // useEffect(() => {
    //   const handleNewMessage = (newMessage) => {
    //     setMessages((prevMessages) => [...prevMessages, newMessage]);
    //   };
    
    //   socket.on("message", handleNewMessage);
    
    //   return () => {
    //     socket.off("message", handleNewMessage); // ✅ Remove old listener when component re-renders
    //   };
    // }, [socket]);

    const handleSendMessage = (e) => {
      e.preventDefault()

      // // add the message obj to the messages array
      // const uuid = uuidv4()
      // setMessages(prevMessages => [...prevMessages, {
      //   id: uuid,
      //   username,
      //   text: currentMessage,
      // }])

      // broadcast message to everyone else in the room
      socket.emit("send_message", {
        username,
        discId,
        text: currentMessage,
        userId: userId,
      })
      setCurrentMessage("")

      // Let the server handle the UI update
      // useEffect(() => {
      //   socket.on("message", (newMessage) => {
      //     setMessages((prevMessages) => [...prevMessages, newMessage])
      //   })

      //   return () => socket.off("message")
      // }, [socket])

      
    }

    const handleLeaveChat = (e) => {
      socket.emit("leavechat", { username, discId })
      // console.log(`${username} had left the ${discId}`)
      navigate('/')
    }

    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const res = await fetch(`/api/soc/allmessages/${discId}`);
          const data = await res.json();
          setDbmessages(data); // Store DB messages
          // setMessages([]); // Clear real-time messages to prevent duplicates
        } catch (error) {
          console.error("Failed to load messages", error);
        }
      };
      fetchMessages();
    }, [discId]);

    // useEffect(() => {
    //   const fetchMessages = async () => {
    //     try {
    //       const res = await fetch(`/api/messages?roomId={roomId}`)
    //       const data = res.json();
    //       setMessages(data)
    //       console.log(data)
    //     } catch (error) {
    //       console.error("Failed to load messages", error)
    //     }
    //   }
    //   fetchMessages()
    // }, [roomId])

    // console.log(dbmessages)
    const mergedMessages = [
      ...dbmessages.map(msg => ({
        id: msg.id,
        username: msg.sender.username,
        text: msg.text,
        type: "message",
        createdAt: msg.createdAt,
        discussionId: msg.discussionId
      })),
      ...messages
    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    // console.log(mergedMessages)

    const queryClient = useQueryClient()
    const { mutate:logout } = useMutation({
      mutationFn: async() => {
        try {
          const res = await fetch("/api/auth/logout", {
            method: "POST",
          })
          const data = await res.json()

          if(!res.ok) {
            throw new Error(data.error || "Something went wrong")
          }

        } catch (error) {
          throw new Error(error)
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["authUser"] })
      },
      onError: () => {
        toast.error("Logout failed")
      }
    })

    const handleLogout = (e) => {
      e.preventDefault()
      logout()
    }
  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <p className="font-semibold mb-2 mt-2 text-xl text-[#0fa4af]">Hey, <span className="text-[#0fa4af]">{username}</span></p>
        <h2 className="font-bold text-2xl text-[#14a76c]">Welcome to <span className="text-[#14a76c]">{roomId}</span> discussion</h2>
        <button className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:outline-none font-semibold rounded-lg px-5 py-2.5 text-center mr-3" onClick={handleLeaveChat}>Go Home</button>
        <button className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-semibold rounded-lg px-5 py-2.5 text-center" onClick={handleLogout}>Logout</button>
      </div>
      <div className={styles.chatMessages}>
        {mergedMessages.map(message => {
          const { id, text, type } = message || {}

          if (type === 'notif') {
            return <div key={id} className={styles.notif}>{text}</div>;
          } else {
            return (
              <div key={id} className={`${styles.chatMessage} ${message.username === username ? styles.myMessage : styles.otherMessage}`}>
                <div className={styles.messageText}>
                  <span className="font-bold mr-1.5 text-[#2e3944]">{message.username}</span>
                  <span className="text-[#262222]">{message.text}</span>
                </div>
              </div>
            )
          }
        })}

        <div className={styles.activityText}>{acivityMsg}</div>
      </div>
      <form onSubmit={handleSendMessage} className={styles.messageForm}>
        <input type='text' placeholder="What's on your mind today ?" value={currentMessage} onChange={handleInputChange} className="flex-1 bg-[#ee4c7c] text-[#ffffff] px-2.5 py-3 pl-4 mr-3 rounded-lg focus:outline-none" required />
        <button type='submit' className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:outline-none font-semibold rounded-lg px-5 py-3 text-center">Send</button>
      </form>
    </div>
  )
}

export default ChatRoom