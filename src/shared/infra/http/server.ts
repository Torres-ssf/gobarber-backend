import 'reflect-metadata';
import 'dotenv/config';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import express, { json, Request, Response, NextFunction } from 'express';
import { errors } from 'celebrate';
import 'express-async-errors';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from '@shared/infra/http/routes';
import swaggerDoc from '@config/documentationUI';
import rateLimiter from './middlewares/rateLimiter';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(json());

app.use(cors());

app.use(rateLimiter);

app.use('/files', express.static(uploadConfig.uploadFolder));

app.use(routes);

app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(errors());

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  console.error(err);

  return res
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
