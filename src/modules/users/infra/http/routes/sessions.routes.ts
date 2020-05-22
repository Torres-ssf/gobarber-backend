import { Router } from 'express';

import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const sessionRoutes = Router();

sessionRoutes.post('/', async (req, res) => {
  const { email, password } = req.body;

  const userRepository = new UserRepository();

  const authenticateService = new AuthenticateUserService(userRepository);

  const { user, token } = await authenticateService.execute({
    email,
    password,
  });

  delete user.password;

  return res.status(200).json({ user, token });
});

export default sessionRoutes;
