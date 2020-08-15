import { container } from 'tsyringe';

import './providers';
import '@modules/users';
import '@modules/appointments';

// apointments
// users
// notification

import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import NotificationRepository from '@modules/notifications/infra/typeorm/repositories/NotificationRepository';

container.registerSingleton<INotificationRepository>(
  'NotificationRepository',
  NotificationRepository,
);
