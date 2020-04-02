# ComicClan back-end

(Management system proposed by Vett.io as code challenge)

## Conception

Build a complete REST API to be consumed by a new social network focused in comic books. The client has the following requests:

- The aplication consists in store and provide posts, comments made by users from ComicClan community.
- The API will be consumed by a desktop front-end and a mobile app.

## Features

This counts with the following features:

- Built along with NodeJs and ExpressJs framework;
- Secure endpoints protected by a OAuth2.0 authentication method;
- Support to GraphQL;
- Microservices pattern;
- Scalable and flexible;
- CORS;

## First Ideas

- Apply TDD as development behaviour;
- Use continuous integration;
- Clean code and redability with SonarQube and ESlint;
- Upload Images using AWS S3 free tier;

## Technologies used

- MongoDB;
- Amazon AWS S3;
- SonarQube;
- TSLint;
- ExpressJs;
- Mocha/Chai;
- Redis;
- Docker;

## Comments

*PROS*

1. Remove load from posts service

2. Does not mix capabilities, thought that comments is another service

3. Well organized and coherent;

*CONS*

1. Need to write in Post's database anyways

2. One more service to set up

3. Memory increasing, not worthy (?)

4. Query all comments in every post


