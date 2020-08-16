import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authenticateService = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateService.execute({
      email,
      password,
    });

    return res.status(200).json({ user: classToClass(user), token });
  }
}
