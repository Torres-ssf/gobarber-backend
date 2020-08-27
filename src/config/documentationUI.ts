const apiConfig = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'GoBarber API',
    description: 'The documentation of the GoBarber API',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
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
        summary: 'Creates a new User',
        description: 'Register request. Creates a new User into the server.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
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
          },
        },
        responses: {
          '200': {
            $ref: '#/components/responses/SuccessfulUserResponse',
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'error',
                    },
                    message: {
                      type: 'string',
                      example: 'Email address already taken',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users/avatar': {
      patch: {
        tags: ['Users'],
        summary: 'Updates user avatar',
        description:
          'Request to update the avatar image from an existent user in the server. This request requires user authentication',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  avatar: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            $ref: '#/components/responses/SuccessfulUserResponse',
          },
          '401': {
            $ref: '#/components/responses/ResponseMissingToken',
          },
        },
      },
    },
    '/sessions': {
      post: {
        tags: ['Sessions'],
        summary: 'Create a new session into the system.',
        description:
          'Creates a new session into the system. This request is used for User authentication. When a correct combination of email and password is provided, the request returns all relevant user information for the client-side and a token that grants access to authenticated users',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
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
          },
        },
        responses: {
          '200': {
            description: 'Successful request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      $ref: '#/definitions/UserResponse',
                    },
                    token: {
                      type: 'string',
                      example:
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTg0NzI5NDYsImV4cCI6MTU5ODU1OTM0Niwic3ViIjoiYTNhYjNlMGMtYjkwOC00MWQ1LWE5N2ItOWI2NGM0MjMxNDY5In0.JPmJOf_3E8rrLb3dfPs9Vd1bOBmI5jwXyO8I7yuuWMI',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
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
    },
  },
  components: {
    schemas: {
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
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    responses: {
      SuccessfulUserResponse: {
        description: 'Successful request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/UserResponse',
            },
          },
        },
      },
      ResponseMissingToken: {
        description: 'Bearer token not provided',
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/ErrorMissingToken',
            },
          },
        },
      },
      ResponseInvalidToken: {
        description: 'Invalid bearer token provided',
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/ErrorInvalidToken',
            },
          },
        },
      },
    },
  },
  definitions: {
    UserResponse: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
        },
        name: {
          type: 'string',
          example: 'Paul Smith',
        },
        email: {
          type: 'string',
          format: 'email',
          example: 'paul_smith@email.com',
        },
        avatar: {
          type: 'string',
          example: 'image filename saved in the system',
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
          example: 'image external storage link',
        },
      },
    },
    ErrorInvalidToken: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error',
        },
        message: {
          type: 'string',
          example: 'Invalid JWT token',
        },
      },
    },
    ErrorMissingToken: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error',
        },
        message: {
          type: 'string',
          example: 'JWT token is missing',
        },
      },
    },
  },
};

export default apiConfig;
