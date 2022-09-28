import { Router } from "express";
import { create, list } from "../controllers/gamesController.js";


const gamesRouter = Router();

gamesRouter.get('/games', list);
gamesRouter.post('/games', create);

export default gamesRouter;