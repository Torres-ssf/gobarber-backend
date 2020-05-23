import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/providers/StorageProvider/fakes/FakeStorageProvider';

describe('CreateUser', () => {
  it('should be able to update user avatar', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const fakeStorageProvider = new FakeStorageProvider();

    const user = await fakeUserRepository.create({
      name: 'Paul Test',
      email: 'paul@email.com',
      password: '123456',
    });

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    expect(user.avatar).toBe(undefined);

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png',
    });

    expect(user.avatar).toBe('avatar.png');
  });
});
