import CreateUserService from '@modules/users/services/CreateUserService';
import FakeAppointmentRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

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
});
