import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import ensuredAuthenticated from '@modules/users/infra/http/middlewares/ensuredAuthenticated';

const userRoutes = Router();
const upload = multer(uploadConfig);

userRoutes.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const userRepository = new UserRepository();

  const createUserService = new CreateUserService(userRepository);

  const user = await createUserService.execute({ name, email, password });

  return res.status(200).json(user);
});

userRoutes.patch(
  '/avatar',
  ensuredAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const userRepository = new UserRepository();

    const updateUserAvatarService = new UpdateUserAvatarService(userRepository);

    const user = await updateUserAvatarService.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    delete user.password;

    return res.status(200).json(user);
  },
);

export default userRoutes;
