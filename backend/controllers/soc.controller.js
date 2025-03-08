import bcryptjs from "bcryptjs";
import prisma from "../db/prisma.js";
import generateToken from "../utils/generateToken.js";

export const getAllMessages = async (req, res) => {
    try {
        const { discId } = req.params;
        const messagesa = await prisma.message.findMany({
            where: { discussionId: discId },
            select: { serverId: true, id: true, text: true, discussionId: true, createdAt: true, sender: true },
            orderBy: { createdAt: 'asc' }})
        res.status(200).json(messagesa)
        console.log("req.query=", req.params)
        console.log(discId)
    } catch (error) {
        console.log("Error in getAllMessages controller", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}