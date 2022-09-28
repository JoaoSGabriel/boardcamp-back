import { Router } from "express";
import { create, list } from "../controllers/categoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get('/categories', list);
categoriesRouter.post('/categories', create);

export default categoriesRouter;