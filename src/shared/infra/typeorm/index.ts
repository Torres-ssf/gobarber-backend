import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export const getTypeormConnection = async (): Promise<Connection> => {
  const options = await getConnectionOptions();

  if (process.env.NODE_ENV !== 'docker') {
    Object.assign(options, {
      host: 'localhost',
    });
  }

  return createConnection(options);
};
