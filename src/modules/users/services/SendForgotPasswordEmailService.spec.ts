import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';

import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

describe('SendForgotPasswordEmailService', () => {
  it('should be able to recover the password using the email ', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeEmailProvider = new FakeMailProvider();

    const sendMail = jest.spyOn(fakeEmailProvider, 'sendMail');

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeEmailProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'David Paul',
      email: 'david00@email.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({ email: user.email });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existent user password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeEmailProvider = new FakeMailProvider();

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeEmailProvider,
    );

    await expect(
      sendForgotPasswordEmail.execute({
        email: 'nonExistentMail@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
