import { MemberRole } from "@prisma/client"
import prisma from "../db/prisma.js"

export const createServer = async (req, res) => {
    try {
        const { serverName } = req.body
        let ownerId = req.user.id

        if (!serverName) {
            return res.status(400).json({ error: "Server must have a name" })
        }

        const newServer = await prisma.server.create({
            data: {
                serverName,
                serverTheme: "always a server" ,
                serverIcon: "svicon.jpeg",
                owner: { connect: { id: ownerId } },
            }
        })

        const newMember = await prisma.member.create({
            data: {
                memberUser: { connect: { id: ownerId } },
                role: MemberRole.OWNER,
                server: { connect: { id: newServer.id } },
            }
        })

        const newDiscussion = await prisma.discussion.create({
            data: {
                server: { connect: { id: newServer.id } },
                discussionDesc: "default channel for every server",
                discussionName: "general",
            }
        })

        res.status(201).json({ serverId: newServer.id })
    } catch (error) {
        console.log("Error in createServer controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getAllDiscussions = async (req, res) => {
    try {
        const { serverId } = req.params
        const discussions = await prisma.discussion.findMany({
            where: { serverId: serverId },
            select: { id: true, discussionName: true, serverId: true }
        })
        console.log(serverId)
        res.status(200).json(discussions)
    } catch (error) {
        console.log("Error in getAllDiscussions controller", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getAllServers = async (req, res) => {
    try {
        const servers = await prisma.server.findMany({
            select: { id: true, serverName: true }
        })
        res.status(200).json(servers)
    } catch (error) {
        console.log("Error in getAllServers controller", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getServerDetails = async (req, res) => {
    try {
        const server = await prisma.server.findUnique({ where: { id: req.params.serverId } })

        if (!server) {
			return res.status(404).json({ error: "Server not found" })
		}

        res.status(200).json({
			id: server.id,
			serverName: server.serverName,
			ownerId: server.ownerId,
		})
    } catch (error) {
        console.log("Error in getServerDetails controller", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const createDiscussion = async (req, res) => {
    try {
        const { discussionName } = req.body
        const { serverId } = req.params

        const newDiscussion = await prisma.discussion.create({
            data: {
                discussionName: discussionName,
                discussionDesc: "aint no dis desc",
                serverId: serverId
            }
        })

        res.status(201).json(newDiscussion)
        console.log(newDiscussion)
    } catch (error) {
        console.log("Error in createDiscussion controller", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}