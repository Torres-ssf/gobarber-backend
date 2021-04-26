import { getTypeormConnection } from '../typeorm';
import { app } from './app';

const server = async (): Promise<void> => {
  await getTypeormConnection();

  app.listen(process.env.PORT || 3333, () => {
    console.log('Server started on port 3333!');
  });
};

server();
