import { Router } from 'express';
import appointmentsRouter from './appointments.routes';
import userRouter from './users.routes';
import sessionRouter from './sessions.routes';
import ensuredAuthenticated from '../middlewares/ensuredAuthenticated';

const routes = Router();

routes.use('/appointments', ensuredAuthenticated, appointmentsRouter);
routes.use('/users', userRouter);
routes.use('/sessions', sessionRouter);

export default routes;
