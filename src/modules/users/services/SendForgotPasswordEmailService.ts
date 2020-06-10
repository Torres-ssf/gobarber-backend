import UsersRepository from '@modules/users/repositories/IUsersRepository';
import MailRepository from '@shared/providers/MailProvider/models/IMailProvider';

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
    this.mailRepository.sendMail(email, 'change password request received');
  }
}

export default SendForgotPasswordEmailService;
