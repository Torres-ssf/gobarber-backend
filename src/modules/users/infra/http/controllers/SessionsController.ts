import { Request, Response } from 'express';

import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const userRepository = new UserRepository();

    const authenticateService = new AuthenticateUserService(userRepository);

    const { user, token } = await authenticateService.execute({
      email,
      password,
    });

    delete user.password;

    return res.status(200).json({ user, token });
  }
}
