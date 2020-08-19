import 'reflect-metadata';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should save data in the cache', async () => {
    const save = jest.spyOn(fakeCacheProvider, 'save');

    await listProvidersService.execute({
      user_id: '23123123',
    });

    expect(save).toHaveBeenCalled();
  });

  it('should look for the saved data in the cache', async () => {
    const recover = jest.spyOn(fakeCacheProvider, 'recover');

    await listProvidersService.execute({
      user_id: '23123123',
    });

    expect(recover).toHaveBeenCalled();
  });

  it('should be able to list the providers', async () => {
    const loggedUser = await fakeUsersRepository.create({
      name: 'Paul',
      email: 'paul@email.com',
      password: '123456',
    });

    const user1 = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@email.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Gustav',
      email: 'gustav@email.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
