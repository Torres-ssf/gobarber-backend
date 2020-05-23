import CreateUserService from '@modules/users/services/CreateUserService';
import FakeAppointmentRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  it('should create a user', async () => {
    const fakeUserRepository = new FakeAppointmentRepository();

    const createUserService = new CreateUserService(fakeUserRepository);

    const user = await createUserService.execute({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
    });

    expect(user).toBeTruthy();
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John');
  });

  it('should not be to create a new user  with an email already registered', async () => {
    const fakeUserRepository = new FakeAppointmentRepository();

    const createUserService = new CreateUserService(fakeUserRepository);

    await createUserService.execute({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
    });

    expect(
      createUserService.execute({
        name: 'John Paul',
        email: 'john@mail.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
