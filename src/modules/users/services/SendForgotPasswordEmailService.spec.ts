import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';

import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeEmailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeEmailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeEmailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email ', async () => {
    const sendMail = jest.spyOn(fakeEmailProvider, 'sendMail');

    const user = await fakeUsersRepository.create({
      name: 'David Paul',
      email: 'david00@email.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute(user.email);

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existent user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute('nonExistentMail@email.com'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generate = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'David Paul',
      email: 'david00@email.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute(user.email);

    expect(generate).toHaveBeenCalledWith(user.id);
  });
});
