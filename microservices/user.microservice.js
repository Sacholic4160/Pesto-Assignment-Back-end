import { Router } from "express";
import { registerUser,loginUser } from "../Services/user.service.js";


const router = Router();

router.post('/register', (req, res) => {const { username, password } = req.body;
  userService.registerUser(username, password)
    .then(user => res.status(201).json(user))
    .catch(error => res.status(400).json(error.message));
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  userService.authenticateUser(username, password)
    .then(user => res.json(user))
    .catch(error => res.status(401).json(error.message));
});
export default router;