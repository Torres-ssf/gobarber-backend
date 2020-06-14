import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    updateProfileService = new UpdateProfileService(fakeUsersRepository);
  });

  it('should be able to update user', async () => {
    const { id } = await fakeUsersRepository.create({
      name: 'Paul',
      email: 'paul@email.com',
      password: '123456',
    });

    const newUser = await updateProfileService.execute({
      user_id: id,
      name: 'John Matias',
      email: 'john@email.com',
    });

    expect(newUser.name).toBe('John Matias');
    expect(newUser.email).toBe('john@email.com');
  });
});
