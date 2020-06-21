import { inject, injectable } from 'tsyringe';
import path from 'path';
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
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const { token } = await this.tokenRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailRepository.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[Gobarber] Password Reset',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
