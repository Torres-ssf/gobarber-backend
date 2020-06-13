import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authconfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUserRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  private userRepository: IUserRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    userRepository: IUserRepository,
    @inject('HashProvider')
    hashProvider: IHashProvider,
  ) {
    this.userRepository = userRepository;
    this.hashProvider = hashProvider;
  }

  async execute({ email, password }: IRequest): Promise<IResponse> {
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

    const { secret, expiresIn } = authconfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
