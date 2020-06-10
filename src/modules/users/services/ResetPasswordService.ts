import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import { addHours, isAfter } from 'date-fns';
import IUsersTokenRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  private usersRepository: IUsersRepository;

  private tokenRepository: IUsersTokenRepository;

  private hashProvider: IHashProvider;

  constructor(
    tokensRepository: IUsersTokenRepository,
    usersRepository: IUsersRepository,
    hashProvider: IHashProvider,
  ) {
    this.tokenRepository = tokensRepository;
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.tokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exitst');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }
    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
