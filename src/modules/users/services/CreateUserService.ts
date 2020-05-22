import { hash } from 'bcryptjs';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

import IUserRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute({ name, email, password }: IRequest): Promise<User> {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('Email address already taken.');
    }

    const hashedPassword = await hash(password, 8);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
