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
  tags: [
    {
      name: 'Users',
      description: 'API for users in the system',
    },
  ],
  paths: {
    '/users': {
      post: {
        tags: ['Users'],
        summary: 'Creates a new user',
        parameters: [
          {
            name: 'body',
            in: 'body',
            description: 'Add new to user in the system',
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                  format: 'email',
                },
                password: {
                  type: 'string',
                  format: 'password',
                  minLength: 6,
                },
              },
            },
          },
        ],
        produces: ['application/json'],
        responses: {
          '200': {
            description: 'OK',
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                  format: 'email',
                },
                id: {
                  type: 'string',
                  format: 'uuid',
                },
                created_at: {
                  type: 'string',
                  format: 'date-time',
                },
                updated_at: {
                  type: 'string',
                  format: 'date-time',
                },
                avatar_url: {
                  type: 'string',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                },
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
  definitions: {
    User: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
        },
        name: {
          type: 'string',
        },
        email: {
          type: 'string',
          format: 'email',
        },
        password: {
          type: 'string',
          minLength: 6,
          format: 'password',
        },
        avatar: {
          type: 'string',
        },
        created_at: {
          type: 'string',
          format: 'date-time',
        },
        updated_at: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
  },
};

export default apiConfig;
