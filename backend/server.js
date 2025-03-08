import path from "path"
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js"
import socRoutes from "./routes/soc.routes.js"
import discRoutes from "./routes/disc.routes.js"
import prisma from './db/prisma.js';
import { initializeSocket } from './socket.js';

dotenv.config()

const app = express()

app.use(cookieParser());
app.use(express.json())

const PORT = process.env.PORT || 5000

const __dirname = path.resolve()

app.use("/api/auth", authRoutes)
app.use("/api/soc", socRoutes)
app.use("/api/disc", discRoutes)

app.use(express.static(path.join(__dirname, "/frontend/dist")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})

const server = app.listen(PORT, () => {
    console.log(`Server is now listening to PORT ${PORT}`)
})

initializeSocket(server)