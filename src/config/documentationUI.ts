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
                $ref: '#/definitions/userAuthenticationSchema',
              },
            },
          },
        },
        responses: {
          '200': {
            $ref: '#/components/responses/responseSuccessfulAuthentication',
          },
          '400': {
            $ref: '#/components/responses/responseErrorAuthentication',
          },
        },
      },
    },
    '/appointments': {
      post: {
        tags: ['Appointments'],
        summary: 'Creates a new appointment',
        description:
          'Request to create a new appointment in the server. This request is used by authenticated users to create appointments with the desired provider. This request requires authentication, therefore, the user id can be retrive from the provided bearer token.',
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
            $ref: '#/components/responses/responseErrorCreatingAppointment',
          },
          '401': {
            $ref: '#/components/responses/ResponseErrorToken',
          },
        },
      },
    },
    '/appointments/me': {
      get: {
        tags: ['Appointments'],
        summary: 'Gets all provider appointments in a day',
        description:
          'Returns all provider appointments in a given day. The day is specified by 3 parameters: day, month and year.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/paramDay',
          },
          {
            $ref: '#/components/parameters/paramMonth',
          },
          {
            $ref: '#/components/parameters/paramYear',
          },
        ],
        responses: {
          '200': {
            $ref:
              '#/components/responses/responseSuccessfulGetProviderAppointments',
          },
          '401': {
            $ref: '#/components/responses/ResponseErrorToken',
          },
        },
      },
    },
    '/providers': {
      get: {
        tags: ['Providers'],
        summary: 'Returns all providers',
        description:
          'Returns all providers with the exception of the authenticated provider',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            $ref: '#/components/responses/responseSuccessfulGetAllProviders',
          },
          '401': {
            $ref: '#/components/responses/ResponseErrorToken',
          },
        },
      },
    },
    '/password/forgot': {
      post: {
        tags: ['Password'],
        summary: 'Request a new password',
        description: 'Can be used by users to request new password.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                  },
                },
              },
              example: {
                email: 'paul_smith@email.com',
              },
            },
          },
        },
        responses: {
          '204': {
            description:
              'Successful request with empty response body. An email with the reset password token was send to the user.',
          },
          '400': {
            description:
              'Bad request. The email provided was not found in the database.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/definitions/globalErrorScheme',
                },
                example: {
                  status: 'error',
                  message: 'User does not exists',
                },
              },
            },
          },
        },
      },
    },
    '/password/reset': {
      post: {
        tags: ['Password'],
        summary: 'Creates a new password',
        description:
          "Request for users create a new password. It's necessary to provide the reset password token, which is receive in the user's email.",
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/passwordResetSchema',
              },
              example: {
                password: '123123',
                password_confirmation: '123123',
                token: '06e56de4-85e4-44d8-9146-a34ca1045d1e',
              },
            },
          },
        },
        responses: {
          '204': {
            description:
              'Successful request with empty response body. The users password was updated',
          },
          '400': {
            $ref: '#/components/responses/responseErrorResetingPassword',
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
            example: '64662b5f-86c7-4789-aca3-fcded3a48a95',
          },
          user_id: {
            type: 'string',
            format: 'uuid',
            example: '935834f4-027a-4e56-b936-4e28f2f3e654',
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
    parameters: {
      paramDay: {
        name: 'day',
        in: 'query',
        description: 'The desirable day of the month',
        required: true,
        schema: {
          type: 'integer',
          format: 'int32',
          minimum: 1,
          maximum: 31,
        },
      },
      paramMonth: {
        name: 'month',
        in: 'query',
        description: 'The desirable month',
        required: true,
        schema: {
          type: 'integer',
          format: 'int32',
          minimum: 1,
          maximum: 12,
        },
      },
      paramYear: {
        name: 'year',
        in: 'query',
        description: 'The desirable year',
        required: true,
        schema: {
          type: 'integer',
          format: 'int32',
        },
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
      responseSuccessfulAuthentication: {
        description: 'Successful authentication response',
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/userSuccessfulAuthenticationSchema',
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
      responseSuccessfulGetAllProviders: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/providersAllSchema',
            },
            example: [
              {
                id: '15f5902b-1360-4590-8c13-2eee9a4cf402',
                name: 'Pedro',
                email: 'pedrinho@email.com',
                avatar: null,
                created_at: '2020-08-18T20:30:41.642Z',
                updated_at: '2020-08-18T21:08:43.911Z',
              },
              {
                id: '054e6677-ef90-4cd0-b1a7-c0095d1b25de',
                name: 'Paul',
                email: 'paul@email.com',
                avatar: '0745c74169a30e967e59-profile.jpeg',
                created_at: '2020-08-17T04:04:27.689Z',
                updated_at: '2020-08-17T04:07:23.935Z',
              },
            ],
          },
        },
      },
      responseSuccessfulGetProviderAppointments: {
        description:
          'A successful response returns an arrray of all appointment schedules for the given day with relevant information, both from the provider and from the user who made the appointment. If no appointments were created for the given day, the server will return an empty array.',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/providerAppointmentsSchema',
              },
            },
            examples: {
              withAppointments: {
                summary: 'with appointments on the day',
                value: [
                  {
                    id: '2968dadf-d946-4139-9243-1d75b6f0eeb4',
                    provider_id: 'bbed7b6d-179c-42aa-a768-1850ef298df9',
                    user_id: '6a623986-d2f9-42ee-bb2a-06c81c46014a',
                    date: '2020-08-29T15:00:00.000Z',
                    created_at: '2020-08-29T02:15:45.451Z',
                    updated_at: '2020-08-29T02:15:45.451Z',
                    user: {
                      id: '6a623986-d2f9-42ee-bb2a-06c81c46014a',
                      name: 'User 10',
                      email: 'user10@email.com',
                      avatar: '8858e5a4b0d8fee3ad80-profile.jpeg',
                      created_at: '2020-08-29T02:14:17.536Z',
                      updated_at: '2020-08-29T02:14:17.536Z',
                      avatar_url:
                        'https://gobarber.s3.amazonaws.com/8858e5a4b0d8fee3ad80-profile.jpeg',
                    },
                  },
                  {
                    id: '6e520d6b-c6ae-404f-8938-30ca1d357202',
                    provider_id: 'bbed7b6d-179c-42aa-a768-1850ef298df9',
                    user_id: '924f11c4-dab3-4ae9-a470-15318d1165ce',
                    date: '2020-08-29T17:00:00.000Z',
                    created_at: '2020-08-29T02:15:59.365Z',
                    updated_at: '2020-08-29T02:15:59.365Z',
                    user: {
                      id: '924f11c4-dab3-4ae9-a470-15318d1165ce',
                      name: 'User 20',
                      email: 'user20@email.com',
                      avatar: '8858e5a4b0d8fee3ad80-profile.jpeg',
                      created_at: '2020-08-29T02:14:26.290Z',
                      updated_at: '2020-08-29T02:14:26.290Z',
                      avatar_url:
                        'https://gobarber.s3.amazonaws.com/8858e5a4b0d8fee3ad80-profile.jpeg',
                    },
                  },
                ],
              },
              withoutAppointments: {
                value: [],
                summary: 'without appointments on the day',
              },
            },
          },
        },
      },
      responseErrorAuthentication: {
        description: 'Bad request',
        content: {
          'json/application': {
            schema: {
              $ref: '#/definitions/globalErrorScheme',
            },
            example: {
              status: 'error',
              message: 'Invalid email/password combination',
            },
          },
        },
      },
      responseErrorCreatingAppointment: {
        description:
          'Bad Request. It can happen weather a user tries to create an appointment in the past, an appointment outside office hours, when there is another appointment already schedule at the same time, or if a user (which is also a provider in this case) tries to create an appointment with him/her self',
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/globalErrorScheme',
            },
            examples: {
              pastDate: {
                $ref: '#/components/examples/exampleErrorPastDate',
              },
              outsideOfficeHours: {
                $ref: '#/components/examples/exampleErrorOutsideOfficeHours',
              },
              alreadyBooked: {
                $ref: '#/components/examples/exampleErrorAlreadyBooked',
              },
              withSelf: {
                $ref: '#/components/examples/exampleErroWithSelf',
              },
            },
          },
        },
      },
      responseErrorResetingPassword: {
        description:
          'Bad request. The token may be expired or nonexistent. This error can also occur if the system cannot find a user id for the provided token',
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/globalErrorScheme',
            },
            examples: {
              expiredToken: {
                $ref: '#/components/examples/exampleErrorUserTokenExpired',
              },
              tokenNonexistent: {
                $ref: '#/components/examples/exampleErrorUserTokenNonexistent',
              },
              userNonexistent: {
                $ref: '#/components/examples/exampleErrorUserNonexistent',
              },
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
              $ref: '#/definitions/globalErrorScheme',
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
        summary: 'missing token',
        value: {
          name: 'error',
          message: 'JWT token is missing',
        },
      },
      invalidTokenBodyExample: {
        summary: 'invalid token',
        value: {
          name: 'error',
          message: 'Invalid JWT token',
        },
      },
      exampleErrorPastDate: {
        summary: 'past date',
        value: {
          name: 'error',
          message: "Can't create an appointment on a past date",
        },
      },
      exampleErrorOutsideOfficeHours: {
        summary: 'outside office hours',
        value: {
          name: 'error',
          message: "Appointments can't be created before 8am and after 5pm",
        },
      },
      exampleErrorAlreadyBooked: {
        summary: 'already booked',
        value: {
          name: 'error',
          message: 'This appointment is already booked',
        },
      },
      exampleErroWithSelf: {
        summary: 'with yourself',
        value: {
          name: 'error',
          message: "You can't create an appointment with yourself",
        },
      },
      exampleErrorUserTokenExpired: {
        summary: 'expired token',
        value: {
          name: 'error',
          message: 'Token expired',
        },
      },
      exampleErrorUserTokenNonexistent: {
        summary: 'nonexistent token',
        value: {
          name: 'error',
          message: 'User token does not exists',
        },
      },
      exampleErrorUserNonexistent: {
        summary: 'nonexistent user',
        value: {
          name: 'error',
          message: 'User does not exists',
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
    userAuthenticationSchema: {
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
    userSuccessfulAuthenticationSchema: {
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
    appointmentsCreateScheme: {
      type: 'object',
      required: ['provider_id', 'date'],
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
    providerAppointmentsSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
        },
        provider_id: {
          type: 'string',
          format: 'uuid',
          example: '64662b5f-86c7-4789-aca3-fcded3a48a95',
        },
        user_id: {
          type: 'string',
          format: 'uuid',
          example: '935834f4-027a-4e56-b936-4e28f2f3e654',
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
        user: {
          $ref: '#/definitions/userResponseScheme',
        },
      },
    },
    providersAllSchema: {
      type: 'array',
      items: {
        $ref: '#/definitions/userResponseScheme',
      },
    },
    passwordResetSchema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
          format: 'password',
          min: 6,
        },
        password_confirmation: {
          type: 'string',
          format: 'password',
          min: 6,
        },
        token: {
          type: 'string',
          format: 'uuid',
        },
      },
    },
    globalErrorScheme: {
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
