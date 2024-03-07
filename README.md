<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Fake blog API

1. Clone the repository.
2. Install the dependencies.
```bash
    npm install
```
3. Clone the file ```env.example``` and rename to ```.env```
4. Change the environment variables.
5. Up the database.
```bash
    docker-compose up -d
```
6. Running the app.
```bash
    npm run start:dev
```
7. Execute seed.
```bash
    http://localhost:3000/api/seed
```
8. [Documentation](http://localhost:3000/docs)