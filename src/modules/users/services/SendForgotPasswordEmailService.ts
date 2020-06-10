import UsersRepository from '@modules/users/repositories/IUsersRepository';
import MailRepository from '@shared/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  private usersRepository: UsersRepository;

  private mailRepository: MailRepository;

  constructor(
    usersRepository: UsersRepository,
    mailRepository: MailRepository,
  ) {
    this.usersRepository = usersRepository;
    this.mailRepository = mailRepository;
  }

  public async execute({ email }: IRequest): Promise<void> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (!userExists) {
      throw new AppError('User does not exists');
    }
    this.mailRepository.sendMail(email, 'change password request received');
  }
}

export default SendForgotPasswordEmailService;
