import 'reflect-metadata';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  let fakeUserRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let fakeCacheProvider: FakeCacheProvider;
  let createUserService: CreateUserService;

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();

    fakeHashProvider = new FakeHashProvider();

    fakeCacheProvider = new FakeCacheProvider();

    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should create a user', async () => {
    const user = await createUserService.execute({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
    });

    expect(user).toBeTruthy();
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John');
  });

  it('should not be able to create a new user with an email already registered', async () => {
    await createUserService.execute({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
    });

    await expect(
      createUserService.execute({
        name: 'John Paul',
        email: 'john@mail.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
