import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailRepository from '@shared/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import IUsersTokenRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  private usersRepository: IUsersRepository;

  private mailRepository: IMailRepository;

  private tokenRepository: IUsersTokenRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('MailRepository')
    mailRepository: IMailRepository,
    @inject('UserTokensRepository')
    tokensRepository: IUsersTokenRepository,
  ) {
    this.usersRepository = usersRepository;
    this.mailRepository = mailRepository;
    this.tokenRepository = tokensRepository;
  }

  public async execute({ email }: IRequest): Promise<void> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (!userExists) {
      throw new AppError('User does not exists');
    }

    await this.tokenRepository.generate(userExists.id);

    this.mailRepository.sendMail(email, 'change password request received');
  }
}

export default SendForgotPasswordEmailService;
