import { Router } from "express";
import { list, rent, returnRental, destroy } from '../controllers/rentalsController.js'

const rentalsRouter = Router();

rentalsRouter.get('/rentals', list)
rentalsRouter.post('/rentals', rent)
rentalsRouter.post('/rentals/:id/return', returnRental)
rentalsRouter.delete('/rentals/:id', destroy)

export default rentalsRouter;