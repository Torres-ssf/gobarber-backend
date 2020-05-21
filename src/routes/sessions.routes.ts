import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionRoutes = Router();

sessionRoutes.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    const authenticateService = new AuthenticateUserService();

    const { user, token } = await authenticateService.execute({
      email,
      password,
    });

    delete user.password;

    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

export default sessionRoutes;
