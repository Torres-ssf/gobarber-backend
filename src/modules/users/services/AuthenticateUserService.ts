import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authconfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUserRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
  provider: boolean;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
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

  async execute({ email, password, provider }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid email/password combination', 401);
    }

    const passwordMatch = await this.hashProvider.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new AppError('Invalid email/password combination', 401);
    }

    if (provider && !user.provider) {
      user.provider = true;

      await this.userRepository.save(user);

      await this.cacheProvider.invalidatePrefix('providers-list');
    }

    const { secret, expiresIn } = authconfig.jwt;

    const token = sign({}, secret as string, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
