import { Router } from "express";
import categoriesRouter from "./categoriesRoute.js";
import customersRouter from "./customersRoute.js";
import gamesRouter from "./gamesRoute.js";
import rentalsRouter from "./rentalsRoute.js";

const router = Router();

router.use(categoriesRouter);
router.use(customersRouter);
router.use(gamesRouter);
router.use(rentalsRouter);

export default router;
