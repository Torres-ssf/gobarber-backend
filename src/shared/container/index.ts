import { container } from 'tsyringe';
import mailCofig from '@config/mail';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsResitory from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUserRepository from '@modules/users/repositories/IUsersRepository';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import HashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';
import StorageProvider from '@shared/providers/StorageProvider/implementations/DiskStorageProvider';

import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import IUsersTokenRepository from '@modules/users/repositories/IUserTokensRepository';

import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider';
import SESMailProvider from '@shared/providers/MailProvider/implementations/SESMailProvider';
import EtherealMailProvider from '@shared/providers/MailProvider/implementations/EtherealMailProvider';

import IMailTemplateProvider from '@shared/providers/MailTemplateProvider/models/IMailTemplateProvider';
import HandleBarsMailTemplateProvider from '@shared/providers/MailTemplateProvider/implementations/HandleBarsMailTemplateProvider';

import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import NotificationRepository from '@modules/notifications/infra/typeorm/repositories/NotificationRepository';

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

container.registerSingleton<IUsersTokenRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<INotificationRepository>(
  'NotificationRepository',
  NotificationRepository,
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandleBarsMailTemplateProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  mailCofig.driver === 'ethereal'
    ? container.resolve(EtherealMailProvider)
    : container.resolve(SESMailProvider),
);
