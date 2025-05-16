import { Router } from "express";
import {apiController} from "../controllers/apiController.js";
const router = Router();

router.get('/stats',apiController.getStats);
router.get('/deviation',apiController.getDeviation);
export default router;