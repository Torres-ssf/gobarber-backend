import { Router } from 'express';

import ensuredAuthenticated from '@modules/users/infra/http/middlewares/ensuredAuthenticated';
import ProvidersController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const dayAvailabilityController = new ProviderDayAvailabilityController();
const monthAvailabilityController = new ProviderMonthAvailabilityController();

providersRouter.use(ensuredAuthenticated);

providersRouter.get('/', providersController.index);

providersRouter.get(
  '/:provider_id/month-availability',
  monthAvailabilityController.index,
);

providersRouter.get(
  '/:provider_id/day-availability',
  dayAvailabilityController.index,
);

export default providersRouter;
