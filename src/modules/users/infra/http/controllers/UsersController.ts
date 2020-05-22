import { Request, Response } from 'express';

import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const userRepository = new UserRepository();

    const createUserService = new CreateUserService(userRepository);

    const user = await createUserService.execute({ name, email, password });

    return res.status(200).json(user);
  }
}
