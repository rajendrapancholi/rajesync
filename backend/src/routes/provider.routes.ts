import { Router } from "express";
import {
  getCategories,
  getProvider,
  getProviders,
  getProviderSlots,
} from "../controllers/provider.controller";
import authMiddleware from "../middlewares/authMiddleware";
import { validateId } from "../middlewares/validateId";

const router = Router();

router.use(authMiddleware);

router.get("/", getProviders);
router.get("/categories", getCategories);
router.get("/:id", validateId(), getProvider);
router.get("/:id/slots", validateId(), getProviderSlots);

export default router;
