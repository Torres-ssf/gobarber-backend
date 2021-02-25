import { container } from 'tsyringe';

import INotificationRepository from './repositories/INotificationRepository';
import FakeNotificationRepository from './repositories/fakes/FakeNotificationRepository';

container.registerSingleton<INotificationRepository>(
  'NotificationRepository',
  FakeNotificationRepository,
);
