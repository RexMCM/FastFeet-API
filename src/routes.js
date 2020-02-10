import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import userController from './app/controllers/userController';
import sessionController from './app/controllers/SessionController';
import recipientsController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import deliveryManController from './app/controllers/deliveryManController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);
// Users routes
routes.post('/api/users', userController.store);
// auth routes
routes.post('/api/session', sessionController.store);

routes.use(authMiddleware);
// recipients routes

routes.post('/api/recipients', recipientsController.store);
routes.put('/api/recipients/:id', recipientsController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/api/deliveryman', deliveryManController.store);
export default routes;
