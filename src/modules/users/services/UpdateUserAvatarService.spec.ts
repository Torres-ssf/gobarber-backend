import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';

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

  it('should not be able to update avatar from a non logged user', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    await expect(
      updateUserAvatarService.execute({
        user_id: 'not-logged-user',
        avatarFilename: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating a new one', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'Paul Test',
      email: 'paul@email.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'new-avatar.png',
    });

    expect(deleteFile).toBeCalledWith('avatar.png');
  });
});
