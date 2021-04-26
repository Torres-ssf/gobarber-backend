import 'reflect-metadata';
import 'dotenv/config';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { errors } from 'celebrate';
import express from 'express';
import 'express-async-errors';
import uploadConfig from '@config/upload';
import routes from '@shared/infra/http/routes';
import swaggerDoc from '@config/documentationUI';
import { expressErrorMiddleware } from './middlewares/expressErrorMiddleware';
import rateLimiter from './middlewares/rateLimiter';

import '@shared/infra/typeorm';
import '@shared/container';

export const app = express();

app.use(express.json());

app.use(cors());

app.use(rateLimiter);

app.use('/files', express.static(uploadConfig.uploadFolder));

app.use(routes);

app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(errors());

app.use(expressErrorMiddleware);
