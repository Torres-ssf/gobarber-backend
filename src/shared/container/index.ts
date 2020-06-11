import { container } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsResitory from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUserRepository from '@modules/users/repositories/IUsersRepository';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import HashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';
import StorageProvider from '@shared/providers/StorageProvider/implementations/DiskStorageProvider';

container.registerSingleton<IUserRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsResitory,
);

container.registerSingleton<IHashProvider>('HashProvider', HashProvider);

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  StorageProvider,
);
