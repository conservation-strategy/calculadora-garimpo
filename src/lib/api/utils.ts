import { NextApiRequest } from "next";

export function logApiRequest(req: NextApiRequest, status: number, duration: number) {
    console.log({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.url,
      status,
      duration,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    });
}