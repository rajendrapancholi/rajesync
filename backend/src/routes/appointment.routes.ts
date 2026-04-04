import { Router } from "express";
import { bookAppointment, getUserAppointments, cancelAppointment } from "../controllers/appointment.controller";
import authMiddleware from "../middlewares/authMiddleware";
import { validateId } from "../middlewares/validateId";

const router = Router();
router.use(authMiddleware);

router.get("/", getUserAppointments);
router.post("/book", bookAppointment);
router.patch("/:id/cancel", validateId(), cancelAppointment);

export default router;
