import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import AppError from '@shared/errors/AppError';

interface IResquest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  new_password?: string;
}

@injectable()
class UpdateProfileService {
  private usersRepository: IUserRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUserRepository,
    @inject('HashProvider')
    hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({
    user_id,
    name,
    email,
    new_password,
    old_password,
  }: IResquest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Unable to find user with given user id');
    }

    const userWithProvidedEmail = await this.usersRepository.findByEmail(email);

    if (userWithProvidedEmail && user.id !== userWithProvidedEmail.id) {
      throw new AppError('Email already in user');
    }

    user.name = name;
    user.email = email;

    if (new_password && !old_password) {
      throw new AppError('The old password is required to set a new password');
    }

    if (new_password && old_password) {
      const passwordMatch = await this.hashProvider.compare(
        old_password,
        user.password,
      );

      if (!passwordMatch) {
        throw new AppError('Current password does not match');
      }

      user.password = await this.hashProvider.generateHash(new_password);
    }

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
