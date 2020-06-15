import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';

import ensuredAuthenticated from '../middlewares/ensuredAuthenticated';

const profileRoutes = Router();

const profileController = new ProfileController();

profileRoutes.get('/', ensuredAuthenticated, profileController.show);
profileRoutes.put('/', ensuredAuthenticated, profileController.update);

export default profileRoutes;
