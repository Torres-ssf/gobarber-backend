import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensuredAuthenticated from '@modules/users/infra/http/middlewares/ensuredAuthenticated';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ListProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const listProviderAppointmentsController = new ListProviderAppointmentsController();

appointmentsRouter.use(ensuredAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.string().required(),
    },
  }),
  appointmentsController.create,
);

appointmentsRouter.get('/me', listProviderAppointmentsController.index);

export default appointmentsRouter;
