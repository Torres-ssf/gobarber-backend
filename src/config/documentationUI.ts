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
            description: 'Add new to user into the system',
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'Paul Smith',
                },
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'paul_smith@email.com',
                },
                password: {
                  type: 'string',
                  format: 'password',
                  minLength: 6,
                  example: '123456',
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
    '/sessions': {
      post: {
        tags: ['Sessions'],
        summary: 'Create a new session into the system.',
        parameters: [
          {
            name: 'body',
            in: 'body',
            description:
              'Create a new session into the system. This request is used for User authentication. When a correct combination of email and password is provided, the request returns all relevant user information for the client-side and a token that grants access to authenticated users',
            schema: {
              type: 'object',
              properties: {
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
                user: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'Paul Smith',
                    },
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'paul_smith@email.com',
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
                    avatar: {
                      type: 'string',
                      example: '0745c74169a30e967e59-profile.jpeg',
                    },
                    avatar_url: {
                      type: 'string',
                    },
                  },
                },
                token: {
                  type: 'string',
                  example:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTgyOTczNDUsImV4cCI6MTU5ODM4Mzc0NSwic3ViIjoiZWE4ZWYwM2EtN2FhNi00ZjI5LWEwMjQtZTRhOWFiNzRkYTE3In0.qfEvEXo9Zw9wHWdh5LrAAWlMVWA-d3w1HeHms_ANo70',
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
                  example: 'error',
                },
                message: {
                  type: 'string',
                  example: 'Invalid email/password combination',
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
