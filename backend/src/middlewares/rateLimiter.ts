import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { Request } from "express";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for Auth (Login/Register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 attempts per 15 mins

  keyGenerator: (req: Request) => {
    // const clientIp = req.ip || "unknown-ip";
    const rawIp = req["ip"] || "unknown-ip";
    const safeIp = ipKeyGenerator(rawIp);
    const userAgent = req.headers["user-agent"] || "no-ua";
    return `${safeIp}_${userAgent}`;
  },
  // validate: { trustProxy: false },
  validate: { trustProxy: false },
  message: { message: "Too many login attempts. Please wait 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});
