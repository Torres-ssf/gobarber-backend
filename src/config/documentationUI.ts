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
                $ref: '#/definitions/userCreateScheme',
              },
              example: {
                name: 'Paul Smith',
                email: 'paul_smith@email.com',
                password: '123456',
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
            $ref: '#/components/responses/ResponseErrorToken',
          },
        },
      },
    },
    '/profile': {
      get: {
        tags: ['Users'],
        summary: 'Gets user information',
        description:
          'Request to return all relevant user information. This requests requires user authentication',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            $ref: '#/components/responses/SuccessfulUserResponse',
          },
          '401': {
            $ref: '#/components/responses/ResponseErrorToken',
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
                      $ref: '#/definitions/userResponseScheme',
                    },
                    token: {
                      type: 'string',
                    },
                  },
                },
                example: {
                  user: {
                    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    name: 'Paul Smith',
                    email: 'paul_smith@email.com',
                    avatar: '94208754a8f9cf345ba0-profile.jpeg',
                    created_at: '2020-08-27T19:15:52.696Z',
                    updated_at: '2020-08-27T19:15:52.696Z',
                    avatar_url:
                      'https://gobarber.amazonaws.com/94208754a8f9cf345ba0-profile.jpeg',
                  },
                  token:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTg0NzI5NDYsImV4cCI6MTU5ODU1OTM0Niwic3ViIjoiYTNhYjNlMGMtYjkwOC00MWQ1LWE5N2ItOWI2NGM0MjMxNDY5In0.JPmJOf_3E8rrLb3dfPs9Vd1bOBmI5jwXyO8I7yuuWMI',
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
    '/appointments': {
      post: {
        tags: ['Appointments'],
        summary: 'Creates a new appointment',
        description:
          'Request to create a new appointment in the server. This request is used by authenticated users to create appointments with the desired provider',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/appointmentsCreateScheme',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'The appointment was successfully created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Appointments',
                },
              },
            },
          },
          '400': {
            description:
              'Bad Request. It can happen weather a user tries to create an appointment in the past, an appointment outside office hours, when there is another appointment already schedule at the same time, or if a user (which is also a provider in this case) tries to create an appointment with him/her self',
            content: {
              'application/json': {
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
                examples: {
                  pastDate: {
                    summary: 'past date',
                    value: {
                      name: 'error',
                      message: "Can't create an appointment on a past date",
                    },
                  },

                  outsideOfficeHours: {
                    summary: 'outside office hours',
                    value: {
                      name: 'error',
                      message:
                        "Appointments can't be created before 8am and after 5pm",
                    },
                  },
                  alreadyBooked: {
                    summary: 'already booked',
                    value: {
                      name: 'error',
                      message: 'This appointment is already booked',
                    },
                  },
                  withSelf: {
                    summary: 'with yourself',
                    value: {
                      name: 'error',
                      message: "You can't create an appointment with yourself",
                    },
                  },
                },
              },
            },
          },
          '401': {
            $ref: '#/components/responses/ResponseErrorToken',
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
      Appointments: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          provider_id: {
            type: 'string',
            format: 'uuid',
          },
          user_id: {
            type: 'string',
            format: 'uuid',
          },
          date: {
            type: 'string',
            format: 'date-time',
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
              $ref: '#/definitions/userResponseScheme',
            },
            example: {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: 'Paul Smith',
              email: 'paul_smith@email.com',
              avatar: '94208754a8f9cf345ba0-profile.jpeg',
              created_at: '2020-08-27T19:15:52.696Z',
              updated_at: '2020-08-27T19:15:52.696Z',
              avatar_url:
                'https://gobarber.amazonaws.com/94208754a8f9cf345ba0-profile.jpeg',
            },
          },
        },
      },
      ResponseErrorToken: {
        description:
          'Unauthorized error. Happens when the bearer token is not provided or the a invalid one was used instead',
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/errorTokenScheme',
            },
            examples: {
              missingToken: {
                $ref: '#/components/examples/missingTokenBodyExample',
              },
              invalidToken: {
                $ref: '#/components/examples/invalidTokenBodyExample',
              },
            },
          },
        },
      },
    },
    examples: {
      missingTokenBodyExample: {
        summary: 'Missing token',
        value: {
          name: 'error',
          message: 'JWT token is missing',
        },
      },
      invalidTokenBodyExample: {
        summary: 'Invalid token',
        value: {
          name: 'error',
          message: 'Invalid JWT token',
        },
      },
    },
  },
  definitions: {
    userResponseScheme: {
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
        avatar_url: {
          type: 'string',
        },
      },
    },
    userCreateScheme: {
      type: 'object',
      required: ['name', 'email', 'password'],
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
    appointmentsCreateScheme: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        provider_id: {
          type: 'string',
          format: 'uuid',
        },
        date: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
    errorTokenScheme: {
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
};

export default apiConfig;
