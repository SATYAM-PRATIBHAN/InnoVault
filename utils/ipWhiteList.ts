// utils/ipWhitelist.ts
import { NextApiRequest, NextApiResponse } from 'next'; // Import the necessary types

const allowedIPs = (process.env.ALLOWED_IPS || "").split(","); // Add trusted IPs here

export function restrictByIP(req: NextApiRequest, res: NextApiResponse, next: Function) {
    const clientIP = req.socket.remoteAddress || "";
    if (!allowedIPs.includes(clientIP)) {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
}