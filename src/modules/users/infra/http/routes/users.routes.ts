import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import ensuredAuthenticated from '@modules/users/infra/http/middlewares/ensuredAuthenticated';

const userRoutes = Router();
const upload = multer(uploadConfig);

userRoutes.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const createUserService = new CreateUserService();

  const user = await createUserService.execute({ name, email, password });

  return res.status(200).json(user);
});

userRoutes.patch(
  '/avatar',
  ensuredAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const updateUserAvatarService = new UpdateUserAvatarService();

    const user = await updateUserAvatarService.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    delete user.password;

    return res.status(200).json(user);
  },
);

export default userRoutes;
