import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import ShowProfileService from '@modules/users/services/ShowProfileService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show user', async () => {
    const newUser = await fakeUsersRepository.create({
      name: 'Paul',
      email: 'paul@email.com',
      password: '123456',
      provider: false,
    });

    const user = await showProfileService.execute({ user_id: newUser.id });

    expect(user.id).toBe(newUser.id);
  });

  it('should not be able to show a non-existing user', async () => {
    await expect(
      showProfileService.execute({ user_id: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
