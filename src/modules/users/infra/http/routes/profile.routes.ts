import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';

import ensuredAuthenticated from '../middlewares/ensuredAuthenticated';

const profileRoutes = Router();

const profileController = new ProfileController();

profileRoutes.put('/', ensuredAuthenticated, profileController.update);

export default profileRoutes;
