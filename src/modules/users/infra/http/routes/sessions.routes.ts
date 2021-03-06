import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const sessionRoutes = Router();
const sessionsController = new SessionsController();

sessionRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      provider: Joi.boolean().default(false),
    },
  }),
  sessionsController.create,
);

export default sessionRoutes;
