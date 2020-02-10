import { Router } from 'express';
import userController from './app/controllers/userController';
import sessionController from './app/controllers/SessionController';
import recipientsController from './app/controllers/RecipientController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Users routes
routes.post('/api/users', userController.store);
// auth routes
routes.post('/api/session', sessionController.store);

routes.use(authMiddleware);
// recipients routes

routes.post('/api/recipients', recipientsController.store);
routes.put('/api/recipients/:id', recipientsController.update);
export default routes;
