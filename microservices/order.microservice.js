import { Router } from "express";
import {createOrder} from '../Services/order.services.js';

const router = Router();

router.post('/', (req, res) => {
  const { userId, productIds, quantities } = req.body;
  orderService.createOrder(userId, productIds, quantities)
    .then(order => res.status(201).json(order))
    .catch(error => res.status(400).json(error.message));
});

export default router;