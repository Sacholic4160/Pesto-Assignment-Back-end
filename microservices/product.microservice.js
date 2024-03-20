import { Router } from "express";
import  {getAllProducts,updateProductById} from '../Services/Product.service.js';

const router = Router();

router.get('/', (req, res) => {
  productService.getAllProducts()
    .then(products => res.json(products))
    .catch(error => res.status(500).json(error.message));
});

router.put('/:id', (req, res) => {
  const productId = req.params.id;
  const updates = req.body;
  productService.updateProductById(productId, updates)
    .then(product => res.json(product))
    .catch(error => res.status(400).json(error.message));
});

export default router;