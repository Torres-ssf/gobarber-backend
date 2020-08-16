import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProfileController from '../controllers/ProfileController';

import ensuredAuthenticated from '../middlewares/ensuredAuthenticated';

const profileRoutes = Router();

const profileController = new ProfileController();

profileRoutes.get('/', ensuredAuthenticated, profileController.show);
profileRoutes.put(
  '/',
  ensuredAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);

export default profileRoutes;
