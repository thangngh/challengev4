import { Router } from "express";
import AuthRouter from "./auth.router";

const router = Router();

router.use('/', AuthRouter)

export default router;
