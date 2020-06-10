import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IUsersTokenRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  private usersRepository: IUsersRepository;

  private tokenRepository: IUsersTokenRepository;

  constructor(
    tokensRepository: IUsersTokenRepository,
    usersRepository: IUsersRepository,
  ) {
    this.tokenRepository = tokensRepository;
    this.usersRepository = usersRepository;
  }

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.tokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exitst');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exitst');
    }

    user.password = password;

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
