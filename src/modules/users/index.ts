import './providers';
import { container } from 'tsyringe';

import IUserRepository from './repositories/IUsersRepository';
import IUsersTokenRepository from './repositories/IUserTokensRepository';

import UsersRepository from './infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from './infra/typeorm/repositories/UserTokensRepository';

container.registerSingleton<IUserRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUsersTokenRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);
