import { Request, Response } from 'express';

import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const userRepository = new UserRepository();

    const updateUserAvatarService = new UpdateUserAvatarService(userRepository);

    const user = await updateUserAvatarService.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    delete user.password;

    return res.status(200).json(user);
  }
}
