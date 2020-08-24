const apiConfig = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'GoBarber API',
    description: 'The documentation of the GoBarber API',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  host: 'localhost:3333',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
};

export default apiConfig;
