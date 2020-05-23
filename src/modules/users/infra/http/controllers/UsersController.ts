import { Request, Response } from 'express';

import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const userRepository = new UserRepository();

    const bcryptHashProvider = new BCryptHashProvider();

    const createUserService = new CreateUserService(
      userRepository,
      bcryptHashProvider,
    );

    const user = await createUserService.execute({ name, email, password });

    return res.status(200).json(user);
  }
}
