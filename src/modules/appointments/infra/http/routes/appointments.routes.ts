import { Router } from 'express';

import ensuredAuthenticated from '@modules/users/infra/http/middlewares/ensuredAuthenticated';
import AppointmentsControllers from '@modules/appointments/infra/http/controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsControllers();

appointmentsRouter.use(ensuredAuthenticated);

appointmentsRouter.get('/', appointmentsController.index);

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
