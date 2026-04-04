import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/express";
import { verifyToken } from "../utils/tokenManager";
import { fetchUserById } from "../services/auth.service";

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Check Header (Mobile) OR Cookies (Web)
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") 
    ? authHeader.split(" ")[1] 
    : req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not authenticated!" });

  try {
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Token is not valid!" });
    }

    // Fetch from MongoDB
    const user = await fetchUserById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found!" });

    req.user = {
      id: user.id, // Mongoose virtual id string
      email: user.email,
      role: (user as any).role || 'user',
    };

    return next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ message: "Authentication failed!" });
  }
};

export default authMiddleware;
