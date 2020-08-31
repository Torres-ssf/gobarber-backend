import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';

import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';

import ensuredAuthenticated from '@modules/users/infra/http/middlewares/ensuredAuthenticated';

const userRoutes = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
const upload = multer(uploadConfig.multer);

userRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6),
    },
  }),
  usersController.create,
);

userRoutes.patch(
  '/avatar',
  ensuredAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default userRoutes;
