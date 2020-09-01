[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->

<br />
<p align="center">

  <img src="logo.png" alt="Logo" width="269" height="98">

  <h3 align="center">Gobarber Backend</h3>

  <p align="center">
   The server-side application for the GoBarber App.
    <br />
    <a href="https://api.gobarber.torres-ssf.com/">Interactive API</a>
    ·
    <a href="https://github.com/Torres-ssf/gobarber-backend/issues">Report Bug</a>
    ·
    <a href="https://github.com/Torres-ssf/gobarber-backend/issues">Request Feature</a>
  </p>
</p>

<!-- ABOUT THE PROJECT -->

## About The Project

Sever-side application for GoBarber, an application for service providers, such as barbers, to control customer schedules, received via the mobile application. This application was designed during the [GoStack](https://rocketseat.com.br/) bootcamp. The application is hosted online and can be used/tested through the [interative API documentation](https://api.gobarber.torres-ssf.com/documentation/).

## API Documentation

Click [ here ](https://api.gobarber.torres-ssf.com/documentation/) to explore the interactive API documentation. The documentation was created with [swagger UI](https://swagger.io/). You can test all API requests. Most requests require user authentication and, as this application uses the bearer's token to grant authorization to users, you will need to create a session before using authenticated requests. To do this, you can simply:

1. Click on the post `users` request to expand it.

2. Click on the `Try it out` button.

3. Insert your credentials to create a new user and then click on the `Execute` button.

4. You should receive an 200 response and that means that your user was successfully created.

5. Now click in the post `sessions` request to exapand it.

6. Click on the `Try it out` button and then provide the user/email combination from the user you just created

7. You should receive a successful response with the authorization token.

8. Now copy the token value and click on the `Authorize` button that lives almost at the top of the page. Paste the value and click on `Authorize` again.

9. Now you are authenticated and can test all requests from the API.

### Built With

The project was built using the following languages stacks:

```sh
Back-End(server)
```

- Node
- Typescript
- [Express](https://www.npmjs.com/package/expresshttps://www.npmjs.com/package/express)
- [TypeORM](https://www.npmjs.com/package/typeorm)
- [PostgreSQL](https://www.npmjs.com/package/pg)
- [MongoDB](https://www.npmjs.com/package/mongodb)
- [Redis](https://www.npmjs.com/package/redis)
- [Nodemailer](https://www.npmjs.com/package/nodemailer)
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Multer](https://www.npmjs.com/package/multer)
- [Handlebars.js](https://www.npmjs.com/package/handlebars)
- [Celebrate](https://www.npmjs.com/package/celebrate)
- [TSyringe](https://www.npmjs.com/package/tsyringe)
- [class-transformer](https://www.npmjs.com/package/class-transformer)
- [date-fns](https://www.npmjs.com/package/date-fns)
- [Mime](https://www.npmjs.com/package/mime)
- [ioredis](https://www.npmjs.com/package/ioredis)
- [node-rate-limiter-flexible](https://www.npmjs.com/package/rate-limiter-flexible)
- [uuid](https://www.npmjs.com/package/uuid)
- [aws-sdk](https://www.npmjs.com/package/aws-sdk)
- [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express)

```sh
Testing Frameworks
```

- [Jest](https://www.npmjs.com/package/jest)


<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

- Node
- NPM
- PostgreSQL
- MongoDB
- Redis

### Installation

1. Clone the repo

```sh
git clone https://github.com/Torres-ssf/gobarber-backend
```

2. CD into the project root directory

```sh
cd gobarber-backend/
```

3. Install npm packages

```sh
yarn
```

4. Set up databases
  This project uses `Postgres`, `MongoDb` and `Redis`. You will need to have all 3 running into your system. I recommend using [Docker](https://www.docker.com/) for simplicity.
  - Make a copy of the `ormconfig.json.example` file and remove the ```.example```.
  - Assign values according with the postgres configuration in your system.

  - Setting up PostgreSQL
    ```json
    "port": 5432,
      "username": "postgres username",
      "password": "postgres password",
      "database": "database name",
    ```
    - Assign the port number that was configured in your system to the `port` object (default is `5432`).  
    - Assign your postgres username to the `username` object.
    - Assign your postgres password to the `password` object.
    - Create a new postgres database and assign the name to the `database` object.

  - Setting up MongoDB
    ```json
    "port": 27017,
    "database": "gobarber",
    ```
    - Assign the MongoDB port number that was configured in your system to the `port` object (default is `27027`).
    - Assign a name of your preference for the database at the `database` object. The new database will be created automatically.

  - Setting up Redis
    - Redis is already setup in the .env.example file with de default port and no password. This should work with it's default settings. If you have a different configuration at your system you will need to make changes on the redis environment variables.

5. Run migrate command to create all migrations.
```
yarn typeorm migration:run
```

6. This applications uses `jsonwebtokenNow` to grant an access token to logged users. 
  - You will need to provide a MD5 hash from an encoded string from your choice. You can generate the hash [here](https://www.md5hashgenerator.com/). 
  - With the hash in hands, we are ready to setup the environment variables. Make a copy of the `.env.example` to and name it `.env`.
  - Assign your generated hash to the variable
  ```
  APP_SECRET=generatedMD5HashHere
  ```

7. Both `APP_WEB_URL` and `APP_API_URL` are already defined at the `.env.example` file. These URLs are ready to be used in development stage for both the web and mobile versions.

8. The app uses Ethereal to test email services in the development stage. But it alsos supports AWS SES. By default `MAIL_PROVIDER` is already configured to use Ethereal, in order to use AWS SES you will need to change the variable value.
```
MAIL_PROVIDER=ses
```

9. In the development stage, the application uses the `tmp/uploads` directory to store files sent to the system (user's avatar). A storage provider was also implemented  to make use of Amazon S3, Simple Storage Service, for the production stage. To use S3, you will need to: 
  - Change the value of the environment variable `STORAGE_DRIVER` from `disk` to `s3`.
  - Assing the bucket name to `AWS_S3_BUCKET_NAME`.
  ```
  STORAGE_DRIVER=s3
  AWS_S3_BUCKET_NAME=bucket-name
  ```

10. All other AWS environments variables should also be assigned with your information and credentials(When using AWS SES and S3 only).

### Usage

App Scripts:

```
yarn dev:server
```

- Script for development stage. If all the installation section was properly made, an output message will appear at the terminal: `Server started on port 3333!`

```
yarn build
```

- Script for productions stage.

```
yarn typeorm
```

- Script design to do typeorm task, like creating and revert migrations.

### Run tests

```
yarn test
```

## Authors

👤 **Torres-ssf**

- Github: [@Torres-ssf](https://github.com/Torres-ssf)
- Twitter: [@torres_ssf](https://twitter.com/torres_ssf)
- Linkedin: [torres-ssf](https://www.linkedin.com/in/torres-ssf/)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check the [issues page](https://github.com/Torres-ssf/gobarber-backend/issues).

## Show your support

Give a ⭐️ if you like this project!

## Acknowledgments

- This project was created during the [GoStack Bootcamp](https://rocketseat.com.br/). I am very grateful to them for the knowledge and skills acquired here.

## 📝 License

This project is [MIT](lic.url) licensed.

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/Torres-ssf/gobarber-backend.svg?style=flat-square
[contributors-url]: https://github.com/Torres-ssf/gobarber-backend/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Torres-ssf/gobarber-backend.svg?style=flat-square
[forks-url]: https://github.com/Torres-ssf/gobarber-backend/network/members
[stars-shield]: https://img.shields.io/github/stars/Torres-ssf/gobarber-backend.svg?style=flat-square
[stars-url]: https://github.com/Torres-ssf/gobarber-backend/stargazers
[issues-shield]: https://img.shields.io/github/issues/Torres-ssf/gobarber-backend.svg?style=flat-square
[issues-url]: https://github.com/Torres-ssf/gobarber-backend/issues