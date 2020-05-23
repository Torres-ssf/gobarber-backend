import { Request, Response } from 'express';

import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import DiskStorageProvider from '@shared/providers/StorageProvider/implementations/DiskStorageProvider';

export default class UserAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const userRepository = new UserRepository();

    const diskStorageProvider = new DiskStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      userRepository,
      diskStorageProvider,
    );

    const user = await updateUserAvatarService.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    delete user.password;

    return res.status(200).json(user);
  }
}
