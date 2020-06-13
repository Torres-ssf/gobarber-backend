import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailRepository from '@shared/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import IUsersTokenRepository from '../repositories/IUserTokensRepository';

@injectable()
class SendForgotPasswordEmailService {
  private usersRepository: IUsersRepository;

  private mailRepository: IMailRepository;

  private tokenRepository: IUsersTokenRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('MailProvider')
    mailRepository: IMailRepository,
    @inject('UserTokensRepository')
    tokensRepository: IUsersTokenRepository,
  ) {
    this.usersRepository = usersRepository;
    this.mailRepository = mailRepository;
    this.tokenRepository = tokensRepository;
  }

  public async execute(email: string): Promise<void> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (!userExists) {
      throw new AppError('User does not exists');
    }

    const { token } = await this.tokenRepository.generate(userExists.id);

    await this.mailRepository.sendMail(
      email,
      `change password request received: ${token}`,
    );
  }
}

export default SendForgotPasswordEmailService;
