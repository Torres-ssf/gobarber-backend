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
    <a href="https://gobarber-api-torres.herokuapp.com/documentation/">Interactive API</a>
    ·
    <a href="https://github.com/Torres-ssf/gobarber-backend/issues">Report Bug</a>
    ·
    <a href="https://github.com/Torres-ssf/gobarber-backend/issues">Request Feature</a>
  </p>
</p>

<!-- ABOUT THE PROJECT -->

## About The Project

Sever-side application for GoBarber, an application for service providers, such as barbers, to control customer schedules. The application is deployed on Heroku and can be tested through the [Interactive API documentation](https://gobarber-api-torres.herokuapp.com/documentation/).

## API Documentation

Click [here](https://gobarber-api-torres.herokuapp.com/documentation/) to explore the interactive API documentation. The documentation was created with [swagger UI](https://swagger.io/). You can test all API requests. Many requests require user authentication and, as this application uses the JWT to grant authorization to users, you will need to create a session before using authenticated requests. To do so, you can simply:

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
- Docker
- [Express](https://www.npmjs.com/package/expresshttps://www.npmjs.com/package/express)
- [TypeORM](https://www.npmjs.com/package/typeorm)
- [PostgreSQL](https://www.npmjs.com/package/pg)
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

This application is dockerized, if have `docker` and `docker-compose` on you system it's pretty straightforward to start using it. To get a local copy up and running follow these simple example steps.

### Prerequisites

- Node
- NPM
- Yarn
- Docker
- PostgreSQL (not needed if you have docker)
- Redis (not needed if you have docker)

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

4. Run the app

  This project uses a docker file to run the app, a Postgres contaner and a Redis container in a shared network. By running `docker-compose up` no additional configuration is required. I recommend using [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) for simplicity. However, if you want to run without Docker, you will need both Postgres and Redis running at your system. Additional steps are also required.
  - Make a copy of both `.env.example` and `ormconfig.example.json` files.
  - Rename `.env.example` copy to `.env`.
  - Rename `ormconfig.example.json` copy to `ormconfig.json`
  - Edit `ormconfig.json` file with your own postgres credentials, remember to also assign an existent database.
  - Redis host and port can be set up at the `.env` file. No password is required.
  - Run the migrations with the command: `yarn typeorm migration:run`.

### Usage

If you have `docker` and `docker-compose` at your system:

```
docker-compose up
```

To remove docker containers after using the app, run:

```
docker-compose down
```

##### App Scripts:

```
yarn dev:server
```
Script for development stage. An output message should appear on the terminal: `Server started on port 3333!`

```
yarn typeorm
```
Used for operations related to Typeorm, like creating migrations.

```
yarn build
```
Transpile Typescript code into Javascript inside the dist directory.

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