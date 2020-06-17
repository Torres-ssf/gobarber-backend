import { Router } from 'express';

import ensuredAuthenticated from '@modules/users/infra/http/middlewares/ensuredAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ListProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const listProviderAppointmentsController = new ListProviderAppointmentsController();

appointmentsRouter.use(ensuredAuthenticated);

appointmentsRouter.get('/', appointmentsController.index);

appointmentsRouter.get('/me', listProviderAppointmentsController.index);

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
