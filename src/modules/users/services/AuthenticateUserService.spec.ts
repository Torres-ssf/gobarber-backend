import 'reflect-metadata';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';

describe('AuthenticateUser', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let createUserService: CreateUserService;
  let authenticateUserService: AuthenticateUserService;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate created user', async () => {
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
    });

    const { email, password } = user;

    const res = await authenticateUserService.execute({ email, password });

    expect(res).toHaveProperty('token');
  });

  it('should not be able to authenticate an uncreated user', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'john@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
    });

    const { email } = user;

    await expect(
      authenticateUserService.execute({
        email,
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
