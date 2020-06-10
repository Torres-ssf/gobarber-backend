import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    resetPasswordService = new ResetPasswordService(fakeUserTokensRepository);
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'David Paul',
      email: 'david00@email.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.email);

    await resetPasswordService.execute({
      password: '123123',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toBe('123123');
  });
});
