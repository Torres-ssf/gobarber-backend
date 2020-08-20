import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

import IUserRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  private userRepository: IUserRepository;

  private hashProvider: IHashProvider;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('UsersRepository')
    userRepository: IUserRepository,
    @inject('HashProvider')
    hashProvider: IHashProvider,
    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.userRepository = userRepository;
    this.hashProvider = hashProvider;
    this.cacheProvider = cacheProvider;
  }

  async execute({ name, email, password }: IRequest): Promise<User> {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('Email address already taken.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

export default CreateUserService;
