const apiConfig = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'GoBarber API',
    description:
      "The documentation of the GoBarber API. This documentation have all supported requests from the API. Most requests require user authentication. The authorization is made through the bearer token, you can simply use the user's post request with your credentials to create a new user then use the session's post request. The session request will return the token which can be used in the 'Authorize' button. This way you will be allowed to use all methods that require authentication.",
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  tags: [
    {
      name: 'Sessions',
      description: 'Operations related to authentication',
    },
    {
      name: 'Users',
      description: 'Operations related to user',
    },
    {
      name: 'Profile',
      description: "Operations related to user's information",
    },
    {
      name: 'Appointments',
      description: 'Operations related to appointments',
    },
    {
      name: 'Providers',
      description: 'Operations related to providers',
    },
    {
      name: 'Password',
      description: "Operations related to user's password",
    },
  ],
  paths: {
    '/sessions': {
      post: {
        tags: ['Sessions'],
        summary: 'Create a new session into the system.',
        description:
          "Creates a new session into the system. This request is used for User authentication. When a correct combination of email and password is provided, the request returns all relevant user information for the client-side and a token that grants access to authenticated users. The provider property is optional, since it's value is false by default",
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
    '/users': {
      post: {
        tags: ['Users'],
        summary: 'Creates a new User',
        description:
          "Register request. Creates a new User into the server. The request body is required. The provider property is optional, since it's value is false by default",
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/userCreateSchema',
              },
              example: {
                name: 'Paul Smith',
                email: 'paul_smith@email.com',
                password: '123456',
                provider: false,
              },
            },
          },
        },
        responses: {
          '200': {
            $ref: '#/components/responses/responseSuccessfulUser',
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
            $ref: '#/components/responses/responseSuccessfulUser',
          },
          '401': {
            $ref: '#/components/responses/responseErrorToken',
          },
        },
      },
    },
    '/profile': {
      get: {
        tags: ['Profile'],
        summary: 'Gets user information',
        description:
          'Request to return all relevant user information. This requests requires user authentication',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            $ref: '#/components/responses/responseSuccessfulUser',
          },
          '401': {
            $ref: '#/components/responses/responseErrorToken',
          },
        },
      },
      put: {
        tags: ['Profile'],
        summary: 'Updates user information',
        description:
          "Request to update user's information. The name and email fields are always required. If the user also wants to update his password, all 3 password properties are required. The server will verify if the new password and password confirmation have the same value.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'json/application': {
              schema: {
                $ref: '#/definitions/userUpdateSchema',
              },
              example: {
                name: 'Paul Smith',
                email: 'paul_smith@email.com',
                old_password: '123456',
                password: '123123',
                password_confirmation: '123123',
              },
            },
          },
        },
        responses: {
          '200': {
            description:
              'Successful request. The server returns a body response with all updated user information.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/definitions/userResponseSchema',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/responseErrorUpdatingUser',
          },
          '401': {
            $ref: '#/components/responses/responseErrorToken',
          },
        },
      },
    },
    '/appointments': {
      post: {
        tags: ['Appointments'],
        summary: 'Creates new appointments',
        description:
          'Request to create a new appointment in the server. This request is used by authenticated users to create appointments with the desired provider. This request requires authentication, therefore, the user id can be retrive from the provided bearer token.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/appointmentsCreateSchema',
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
            $ref: '#/components/responses/responseErrorToken',
          },
        },
      },
    },
    '/appointments/me': {
      get: {
        tags: ['Appointments'],
        summary: "Gets all provider's appointments in a day",
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
            $ref: '#/components/responses/responseErrorToken',
          },
        },
      },
    },
    '/providers': {
      get: {
        tags: ['Providers'],
        summary: 'Returns all providers',
        description:
          'Returns all providers saved in the system with the exception of the provider who made the request.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            $ref: '#/components/responses/responseSuccessfulGetAllProviders',
          },
          '401': {
            $ref: '#/components/responses/responseErrorToken',
          },
        },
      },
    },
    '/providers/{provider_id}/day-availability': {
      get: {
        tags: ['Providers'],
        summary: "Returns provider's daily availability",
        description:
          'Returns a list with all available daily schedules from a provider. This request requires user authentication.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/paramProviderId',
          },
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
              '#/components/responses/responseSuccessfulGetProviderDailyAvailability',
          },
          '401': {
            $ref: '#/components/responses/responseErrorToken',
          },
        },
      },
    },
    '/providers/{provider_id}/month-availability': {
      get: {
        tags: ['Providers'],
        summary: "Returns provider's monthly availability",
        description:
          'Returns a list with all available monthly schedules from a provider. This request requires user authentication.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            $ref: '#/components/parameters/paramProviderId',
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
              '#/components/responses/responseSuccessfulGetProviderMonthlyAvailability',
          },
          '401': {
            $ref: '#/components/responses/responseErrorToken',
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
                  $ref: '#/definitions/globalErrorSchema',
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
          provider: {
            type: 'boolean',
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
      paramProviderId: {
        name: 'provider_id',
        in: 'path',
        required: true,
        description: 'Path param for the provider id',
        schema: {
          type: 'string',
          format: 'uuid',
        },
      },
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
      responseSuccessfulUser: {
        description: 'Successful request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/userResponseSchema',
            },
            example: {
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              name: 'Paul Smith',
              email: 'paul_smith@email.com',
              avatar: '94208754a8f9cf345ba0-profile.jpeg',
              provider: false,
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
                provider: false,
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
          'A successful response returns an array of all appointment schedules for the given day. Each item from the array contains relevant information, both from the provider and from the user who made the appointment. If no appointments were created for the given day, the server will return an empty array.',
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
      responseSuccessfulGetProviderDailyAvailability: {
        description:
          'Successful request. Returns an array object with the daily availability for to given provider. Hours gone by or hours with appointments already scheduled, will return the available propertie with false as a value',
        content: {
          'json/application': {
            schema: {
              $ref: '#/definitions/providerDailyAvailability',
            },
            example: [
              {
                hour: 8,
                available: false,
              },
              {
                hour: 9,
                available: false,
              },
              {
                hour: 10,
                available: false,
              },
              {
                hour: 11,
                available: false,
              },
              {
                hour: 12,
                available: false,
              },
              {
                hour: 13,
                available: true,
              },
              {
                hour: 14,
                available: false,
              },
              {
                hour: 15,
                available: true,
              },
              {
                hour: 16,
                available: true,
              },
              {
                hour: 17,
                available: false,
              },
            ],
          },
        },
      },
      responseSuccessfulGetProviderMonthlyAvailability: {
        description:
          'Successful request. Returns an array object with the monthly availability for to given provider. Days gone by or days when there are no more vacant times to create appointments, will return the available propertie with false as a value',
        content: {
          'json/application': {
            schema: {
              $ref: '#/definitions/providerMonthlyAvailability',
            },
            example: [
              {
                day: 1,
                available: false,
              },
              {
                day: 2,
                available: false,
              },
              {
                day: 3,
                available: false,
              },
              {
                day: 4,
                available: false,
              },
              {
                day: 5,
                available: false,
              },
              {
                day: 6,
                available: false,
              },
              {
                day: 7,
                available: false,
              },
              {
                day: 8,
                available: false,
              },
              {
                day: 9,
                available: false,
              },
              {
                day: 10,
                available: false,
              },
              {
                day: 11,
                available: false,
              },
              {
                day: 12,
                available: false,
              },
              {
                day: 13,
                available: false,
              },
              {
                day: 14,
                available: false,
              },
              {
                day: 15,
                available: false,
              },
              {
                day: 16,
                available: false,
              },
              {
                day: 17,
                available: false,
              },
              {
                day: 18,
                available: false,
              },
              {
                day: 19,
                available: false,
              },
              {
                day: 20,
                available: false,
              },
              {
                day: 21,
                available: false,
              },
              {
                day: 22,
                available: false,
              },
              {
                day: 23,
                available: false,
              },
              {
                day: 24,
                available: false,
              },
              {
                day: 25,
                available: false,
              },
              {
                day: 26,
                available: false,
              },
              {
                day: 27,
                available: false,
              },
              {
                day: 28,
                available: false,
              },
              {
                day: 29,
                available: true,
              },
              {
                day: 30,
                available: true,
              },
              {
                day: 31,
                available: true,
              },
            ],
          },
        },
      },
      responseErrorAuthentication: {
        description: 'Bad request',
        content: {
          'json/application': {
            schema: {
              $ref: '#/definitions/globalErrorSchema',
            },
            example: {
              status: 'error',
              message: 'Invalid email/password combination',
            },
          },
        },
      },
      responseErrorUpdatingUser: {
        description:
          'Bad request. It can happen whether the user tries to update his email to another one that is already beeing used in the database, or if the user tries to updates his password without providing the current one, or even if the user provide the wrong current password.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/globalErrorSchema',
            },
            examples: {
              userNotFound: {
                $ref: '#/components/examples/exampleErrorUserNonexistent',
              },
              takenEmail: {
                $ref: '#/components/examples/exampleErrorEmailTaken',
              },
              missingPassword: {
                $ref:
                  '#/components/examples/exampleErrorMissingCurrentPassword',
              },
              wrongPassword: {
                $ref: '#/components/examples/exampleErrorWrongPassword',
              },
            },
          },
        },
      },
      responseErrorCreatingAppointment: {
        description:
          'Bad Request. It can happen whether a user tries to create an appointment in the past, an appointment outside office hours, when there is another appointment already schedule at the same time, or if a user (which is also a provider in this case) tries to create an appointment with him/her self',
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/globalErrorSchema',
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
              $ref: '#/definitions/globalErrorSchema',
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
      responseErrorToken: {
        description:
          'Unauthorized error. Happens when the bearer token is not provided or the a invalid one was used instead',
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/globalErrorSchema',
            },
            examples: {
              missingToken: {
                $ref: '#/components/examples/exampleErrorMissingTokenBody',
              },
              invalidToken: {
                $ref: '#/components/examples/exampleErrorInvalidTokenBody',
              },
            },
          },
        },
      },
    },
    examples: {
      exampleErrorMissingTokenBody: {
        summary: 'missing token',
        value: {
          name: 'error',
          message: 'JWT token is missing',
        },
      },
      exampleErrorInvalidTokenBody: {
        summary: 'invalid token',
        value: {
          name: 'error',
          message: 'Invalid JWT token',
        },
      },
      exampleErrorUserNonexistent: {
        summary: 'nonexistent user',
        value: {
          name: 'error',
          message: 'User does not exists',
        },
      },
      exampleErrorEmailTaken: {
        summary: 'email already registered',
        value: {
          name: 'error',
          message: 'Email already in user',
        },
      },
      exampleErrorWrongPassword: {
        summary: 'wrong password',
        value: {
          name: 'error',
          message: 'Current password does not match',
        },
      },
      exampleErrorMissingCurrentPassword: {
        summary: 'missing current password',
        value: {
          name: 'error',
          message: 'The current password is required to update for a new one',
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
    },
  },
  definitions: {
    userResponseSchema: {
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
        provider: {
          type: 'boolean',
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
    userCreateSchema: {
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
        provider: {
          type: 'boolean',
        },
      },
    },
    userUpdateSchema: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: {
          type: 'string',
        },
        email: {
          type: 'string',
          format: 'email',
        },
        old_password: {
          type: 'string',
          format: 'password',
          minLength: 6,
        },
        password: {
          type: 'string',
          format: 'password',
          minLength: 6,
        },
        password_confirmation: {
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
        provider: {
          type: 'boolean',
          example: false,
        },
      },
    },
    userSuccessfulAuthenticationSchema: {
      type: 'object',
      properties: {
        user: {
          $ref: '#/definitions/userResponseSchema',
        },
        token: {
          type: 'string',
        },
      },
    },
    appointmentsCreateSchema: {
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
          $ref: '#/definitions/userResponseSchema',
        },
      },
    },
    providerDailyAvailability: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          hour: {
            type: 'integer',
            format: 'int32',
            minimum: 8,
            maximum: 17,
          },
          available: {
            type: 'boolean',
          },
        },
      },
    },
    providerMonthlyAvailability: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: {
            type: 'integer',
            format: 'int32',
            minimum: 1,
            maximum: 31,
          },
          available: {
            type: 'boolean',
          },
        },
      },
    },
    providersAllSchema: {
      type: 'array',
      items: {
        $ref: '#/definitions/userResponseSchema',
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
    globalErrorSchema: {
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
