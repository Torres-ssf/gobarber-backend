import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import IUserRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  private userRepository: IUserRepository;

  private storageProvider: IStorageProvider;

  constructor(
    @inject('UsersRepository')
    userRepository: IUserRepository,
    @inject('StorageProvider')
    storageProvider: IStorageProvider,
  ) {
    this.userRepository = userRepository;
    this.storageProvider = storageProvider;
  }

  async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated user can change avatar.', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    await this.storageProvider.saveFile(avatarFilename);

    user.avatar = avatarFilename;

    await this.userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
