import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensuredAuthenticated from '../middlewares/ensuredAuthenticated';

const userRoutes = Router();
const upload = multer(uploadConfig);

userRoutes.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({ name, email, password });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

userRoutes.patch(
  '/avatar',
  ensuredAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    try {
      const updateUserAvatarService = new UpdateUserAvatarService();

      const user = await updateUserAvatarService.execute({
        user_id: req.user.id,
        avatarFilename: req.file.filename,
      });

      delete user.password;

      return res.status(200).json(user);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
);

export default userRoutes;
