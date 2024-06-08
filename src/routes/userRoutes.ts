import { createUserIfNotExist } from "../controllers/userController";
import { Router } from "express";

const router = Router();

router.post("/auth", createUserIfNotExist);

export default router;
