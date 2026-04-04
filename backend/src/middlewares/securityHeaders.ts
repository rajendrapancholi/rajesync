import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { ENV } from "../config/env";

const CSRF_SECRET = ENV.CSRF_SECRET;

export const advancedSecurity = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userIp = req.ip || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"] || "unknown";
  const csrfToken = req.headers["x-xsrf-token"] as string;
  const mobileHeader = req.headers["x-requested-with"];
  const deviceId = req.headers["x-device-id"] || "unknown";

  // Create a fingerprint of the current requester
  const fingerprint = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(`${deviceId}-${userIp}-${userAgent}`)
    .digest("hex");

  // Mobile Logic: High-trust header + Fingerprint validation
  console.log('Debug mobleHeader: ', mobileHeader);
  console.table({mobileHeader, csrfToken, fingerprint, deviceId, userAgent, userIp});

  if (mobileHeader === "EcoTechMobile") {
    if (csrfToken !== fingerprint) {
      return res
        .status(403)
        .json({ message: "Mobile security fingerprint mismatch." });
    }
    return next();
  }

  // Web Logic: Standard XSRF Token validation
  if (!csrfToken || csrfToken !== fingerprint) {
    return res.status(403).json({ message: "Invalid or missing XSRF token." });
  }

  next();
};
