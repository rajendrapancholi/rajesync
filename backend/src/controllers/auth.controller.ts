import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken, blacklistToken } from "../utils/tokenManager";
import * as authService from "../services/auth.service";
import type { AuthRequest } from "../types/express";
import asyncHandler from "../utils/asyncHandler";
import crypto from "crypto";
import { ENV } from "../config/env";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, pass, confPass } = req.body;

  if (!name || !email || !pass) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  if (pass !== confPass)
    return res.status(400).json({ message: "Passwords do not match!" });

  const existingUser = await authService.findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: "User already registered!" });
  }

  const user = await authService.createUser({ name, email, pass });

  return res.status(201).json({
    message: "success",
    user: { id: user.id, name: user.name, email: user.email },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, pass } = req.body;

  if (!email || !pass)
    return res.status(400).json({ message: "All fields are required!" });

  const user = await authService.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials!" });
  }

  const isPasswordValid = await bcrypt.compare(pass, user.password_hash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials!" });
  }

  // Generate token using Mongoose virtual .id
  const token = generateToken({ id: user.id, email: user.email });

  // Cookie for web compatibility
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // for mobile comaptibility
  return res.json({
    message: "Login success",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user?.id)
    return res.status(404).json({ message: "User not found!" });

  const user = await authService.fetchUserById(req.user?.id || "");

  if (!user) return res.status(404).json({ message: "User not found!" });

  console.table({
    ID: user.id,
    Name: user.name,
    Email: user.email,
    img: user.image_url,
    Role: user.role || "user",
  });

  return res.json({
    message: "Success",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image_url: user.image_url || null,
      role: user.role || "user",
    },
  });

  return res.json({ message: "Success", user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies.token;

  if (token) await blacklistToken(token);

  res.clearCookie("token");
  return res.json({ success: true, message: "Logged out successfully" });
});

export const getCsrfToken = (req: Request, res: Response) => {
  const userIp = req.ip || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"] || "unknown";
  const deviceId = req.headers["x-device-id"] || "unknown-device";
  const token = crypto
    .createHmac("sha256", ENV.CSRF_SECRET)
    .update(`${deviceId}-${userIp}-${userAgent}`)
    .digest("hex");

  // Send as a cookie for Web and JSON for Mobile
  res.cookie("XSRF-TOKEN", token, {
    httpOnly: false,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({ csrfToken: token });
};
