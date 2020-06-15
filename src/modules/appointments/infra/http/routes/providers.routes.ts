import { Router } from 'express';

import ensuredAuthenticated from '@modules/users/infra/http/middlewares/ensuredAuthenticated';
import ProvidersController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const providersRouter = Router();
const providersController = new ProvidersController();

providersRouter.use(ensuredAuthenticated);

providersRouter.get('/', providersController.index);

export default providersRouter;
