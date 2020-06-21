import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user', async () => {
    const { id } = await fakeUsersRepository.create({
      name: 'Paul',
      email: 'paul@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: id,
      name: 'John Matias',
      email: 'john@email.com',
    });

    expect(updatedUser.id).toBe(id);
    expect(updatedUser.name).toBe('John Matias');
    expect(updatedUser.email).toBe('john@email.com');
  });

  it('should be not able to update invalid user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'invalid-id',
        name: 'Paul Matias',
        email: 'new@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update email already in use', async () => {
    const { email: takenEmail } = await fakeUsersRepository.create({
      name: 'Taken',
      email: 'taken@email.com',
      password: '123456',
    });

    const { id } = await fakeUsersRepository.create({
      name: 'Paul',
      email: 'paul@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: id,
        name: 'Paul Matias',
        email: takenEmail,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Paul',
      email: 'paul@email.com',
      password: '123456',
    });

    await updateProfileService.execute({
      user_id: user.id,
      name: user.name,
      email: user.email,
      old_password: '123456',
      password: '123123',
    });

    expect(user.password).toBe(user.password);
  });

  it('should not be able to update password without old password', async () => {
    const { id, email } = await fakeUsersRepository.create({
      name: 'Paul',
      email: 'paul@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: id,
        name: 'Paul Matias',
        email,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    const { id, name, email } = await fakeUsersRepository.create({
      name: 'Paul',
      email: 'paul@email.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: id,
        name,
        email,
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
