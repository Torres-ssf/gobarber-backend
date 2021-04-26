import 'reflect-metadata';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';

describe('AuthenticateUser', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let fakeCacheProvider: FakeCacheProvider;
  let createUserService: CreateUserService;
  let authenticateUserService: AuthenticateUserService;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to authenticate created user', async () => {
    const user = await createUserService.execute({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
      provider: false,
    });

    const { email, password, provider } = user;

    const res = await authenticateUserService.execute({
      email,
      password,
      provider,
    });

    expect(res).toHaveProperty('token');
  });

  it('should not be able to authenticate an uncreated user', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'john@mail.com',
        password: '123456',
        provider: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should update user to be a provider if provider value is true and user is not a provider yet', async () => {
    const user = await createUserService.execute({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
      provider: false,
    });

    const { email, password } = user;

    await expect(
      authenticateUserService.execute({
        email,
        password,
        provider: true,
      }),
    ).resolves.toHaveProperty(['user', 'provider'], true);
  });

  it('should not update user to be a provider if provider value is true and user is not a provider yet', async () => {
    const user = await createUserService.execute({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
      provider: false,
    });

    const { email, password } = user;

    await expect(
      authenticateUserService.execute({
        email,
        password,
        provider: false,
      }),
    ).resolves.toHaveProperty(['user', 'provider'], false);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const user = await createUserService.execute({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
      provider: false,
    });

    const { email } = user;

    await expect(
      authenticateUserService.execute({
        email,
        password: 'wrong-password',
        provider: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
