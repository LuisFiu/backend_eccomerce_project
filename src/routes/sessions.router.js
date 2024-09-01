import { Router } from "express";

import { passportCall } from "../middlewares/passportCall.js";
import sessionsController from "../controllers/sessions.controller.js";

const router = Router();

router.post("/register", passportCall("register"), sessionsController.register);

router.post("/login", passportCall("login"), sessionsController.login);

router.get("/current", passportCall("current"), sessionsController.current);

router.get("/logout", sessionsController.logout);

export default router;
