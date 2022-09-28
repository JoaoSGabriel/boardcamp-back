import { Router } from "express";
import { create, getByID, list, updateCustomer } from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get('/customers', list);
customersRouter.get('/customers/:id', getByID);
customersRouter.put('/customers/:id', updateCustomer);
customersRouter.post('/customers', create);

export default customersRouter;