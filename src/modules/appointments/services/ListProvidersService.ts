import { inject, injectable } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '@modules/users/infra/typeorm/entities/User';

interface IResquest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  private usersRepository: IUserRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUserRepository,
    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.usersRepository = usersRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute({ user_id }: IResquest): Promise<User[]> {
    let providers = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );

    if (!providers) {
      providers = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(`providers-list:${user_id}`, providers);
    }

    return providers;
  }
}

export default ListProvidersService;
