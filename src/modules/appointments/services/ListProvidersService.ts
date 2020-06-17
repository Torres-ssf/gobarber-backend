import { inject, injectable } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface IResquest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  private usersRepository: IUserRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUserRepository,
  ) {
    this.usersRepository = usersRepository;
  }

  public async execute({ user_id }: IResquest): Promise<User[]> {
    const providers = await this.usersRepository.findAllProviders({
      except_user_id: user_id,
    });

    return providers;
  }
}

export default ListProvidersService;
