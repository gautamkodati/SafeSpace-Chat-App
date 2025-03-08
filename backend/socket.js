import { Server } from 'socket.io'
import prisma from "./db/prisma.js";

let io

export const initializeSocket = (server) => {
    io = new Server(server, {
      cors: { origin: "*" },
    })
  
    io.on("connection", (socket) => {
      console.log(`User ${socket.id} is connected`)
  
      // Handling user joining a room
      socket.on("user_join_room", ({ username, discId }) => {
        socket.join(discId);
        socket.to(discId).emit("user_join_room", `${username} has joined the chat`)
        console.log(`${username} has joined room ${discId}`)
      })
  
      // Handling message sending
      socket.on("send_message", async ({ username, discId, text, type }) => {
        try {
            const discussId = discId
            // const usernamed = await prisma.user.findUnique({ where: { username: username, discussionId: discId } })
            const discussionm = await prisma.discussion.findUnique({
              where: { id: discussId },
              select: { serverId: true }
            })

          const newMsg = await prisma.message.create({
            data: { 
              sender: { connect: { username: username } },
              text: text,
              imgpic: "0.png",
              type,
              username,
              server: { connect: { id: discussionm.serverId } },
              discussion: { connect: { id: discussId } }
            }
          })
  
          io.to(discId).emit("message", newMsg) // Emit to all users in the room
        } catch (error) {
          console.error("Error saving message:", error)
        }
      })
  
      // Handling user leaving a room
      socket.on("user_left_room", ({ username, discId }) => {
        io.to(discId).emit("message", { username, text: `${username} has left the room`, type: "notif" })
      })
  
      // Handling activity detection
      socket.on("user_typing", ({ username, discId }) => {
        io.to(discId).emit("user_typing", username)
      })
  
      // Handling manual chat leave
      socket.on("leavechat", ({ username, discId }) => {
        socket.leave(discId);
        console.log(`${username} has left room ${discId}`)
      })
  
      socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`)
      })
    })
  
    return io
}
  
export const getIo = () => {
    if (!io) throw new Error("Socket.io not initialized")
    return io
}