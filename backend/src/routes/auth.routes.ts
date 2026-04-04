import { Router } from "express";
import {
  getCsrfToken,
  login,
  logout,
  me,
  register,
} from "../controllers/auth.controller";
import authMiddleware from "../middlewares/authMiddleware";
import { apiLimiter, authLimiter } from "../middlewares/rateLimiter";
import { advancedSecurity } from "../middlewares/securityHeaders";

const router = Router();

/**
 * CSRF Token Handshake
 * This MUST be public and called before any other requests.
 * We apply apiLimiter to prevent spamming the token generator.
 */
router.get("/csrf-token", apiLimiter, getCsrfToken);

/**
 * Global Security
 * Everything below this line requires the custom 'EcoTechMobile' header
 * and a valid 'X-XSRF-TOKEN' fingerprint.
 */
router.use(advancedSecurity);

router.get("/me", authMiddleware, me);
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", authMiddleware, logout);

export default router;
