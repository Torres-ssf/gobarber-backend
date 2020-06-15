import 'reflect-metadata';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProvidersService = new ListProvidersService(fakeUsersRepository);
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
