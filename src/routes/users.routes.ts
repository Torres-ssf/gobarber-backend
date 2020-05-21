import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';

const userRoutes = Router();

userRoutes.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({ name, email, password });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

export default userRoutes;
