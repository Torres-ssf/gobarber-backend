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
    <a href="#">API Documentation (SOON)</a>
    ·
    <a href="https://github.com/Torres-ssf/gobarber-backend/issues">Report Bug</a>
    ·
    <a href="https://github.com/Torres-ssf/gobarber-backend/issues">Request Feature</a>
  </p>
</p>

<!-- ABOUT THE PROJECT -->

## About The Project

Sever-side application for GoBarber, an app for service providers, such as Barbers, to control customer schedules, received via the Mobile application. This application was designed during the [GoStack](https://rocketseat.com.br/) bootcamp.

## API Documentation

Click [ here ](https://github.com/Torres-ssf/gobarber-backend/) to explore the API documentation(SOON).

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
- [aws-sdk](https://www.npmjs.com/package/aws-sdk)

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
  - Make a copy of the `example.ormconfig.json` file and rename it removing the ```example.```.
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
    - Assign an existent postgres database name to the `database` object.

  - Setting up MongoDB
    ```json
    "port": 27017,
    "database": "gobarber",
    ```
    - Assign the MongoDB port number that was configured in your system to the `port` object (default is `27027`).
    - Assign a name of your preference for the database at the `database` object. The new database will be created automatically.

  - Setting up Redis
    - Redis is already setup in the .env.example file. You just need to have it running into your system.

5. Run migrate command to create all migrations.
```
yarn typeorm migration:run
```

6. This applications uses `jsonwebtokenNow` to grant an access token to logged users. 
  - You will need to provide a MD5 hash from an encoded string from your choice. You can generate the hash [here](https://www.md5hashgenerator.com/). 
  - With the hash in hands, we are ready to setup the environment variable. Rename the `.env.example` to `.env`.
  - Assign your generated hash to the variable
  ```
  APP_SECRET=generatedMD5HashHere
  ```

7. Both `APP_WEB_URL` and `APP_API_URL` are already defined at the `.env.example` file. These URLs are ready to be used in development stage for both the web and mobile versions.

8. This uses Ethereal to test email services in the development stage. But it alsos supports AWS SES. By default `MAIL_PROVIDER` is already configured to use Ethereal, in order to use AWS SES you will need to change the variable value.
```
MAIL_PROVIDER=ses
```

9. All other AWS environments variables should also be assigned with your information and credentials(When using AWS SES only).

### Usage

App Scripts:

```
yarn dev:server
```

Script for development stage. If all the installation section was properly made, an output message will appear at the terminal.
```
Server started on port 3333!
```

```
yarn typeorm
```

Script design to do typeorm task, like creating and revert migrations.

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

- Built this project was only possible because of the skills I aquired during the [GoStack Bootcamp](https://rocketseat.com.br/).

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