import { container } from 'tsyringe';

import IAppointmentsRepository from './repositories/IAppointmentsRepository';
import AppointmentsResitory from './infra/typeorm/repositories/AppointmentsRepository';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsResitory,
);
