import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  it('should create a user', async () => {
    const fakeUserRepository = new FakeUsersRepository();

    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

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
    const fakeUserRepository = new FakeUsersRepository();

    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

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
