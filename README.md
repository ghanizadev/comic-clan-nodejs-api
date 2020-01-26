# ComicClan - Node.js API Specification

### Description

ComicClan, an online community of comic book enthusiasts, has contacted you to help them develop a new REST API service for their new social network of comic book lovers. 

They have a front-end and mobile app already in development, but are looking for a developer to outline, plan and build the REST API service and DB to support their desired app features.

### Features

The ComicClan social network revolves around the love of comic books, therefore the main purpose of the site is to be able to share thoughts, ideas and news about comic books, and have a discussion about it.

The backend service should be a REST API that supports the following actions:

- User registration.
- User authentication (to prevent unregistered users from viewing content).
- Posting a post (text only).
- Commenting on a post (text only).
- Get all posts, sorted by date.
- Get all comments, grouped by posts and sorted by date.

### Specifications

- The service should be written in Node.js (10 or higher) with Express.js.
- The selection of the DB type (SQL or NoSQL), scheme and ORM is up to you. 
- Please make sure to fill the DB with test data.
- Endpoints should be secure and allow only authenticated users from accessing them (except the registration endpoint).
- When fetching Posts or Comments the service should support pagination (to allow infinite scroll on the news feed).
- Take into consideration the API will not serve the frontend files or render the frontend app and therefore should be stateless (without a session). 
- The API should have CORS enabled with whitelisted domains controlled by a configuration file.
- Please attach a dump of the DB data and scheme.
- You may use any boilerplate of your choice or start completely clean.


### Bonus Points

- Add support for images in posts and comments.
- Setting up the service in a docker container (along with the DB).
- Add a “follow” option for posts so you get notified (by email) anytime someone comments.
- Adding a websocket to so that the app has real-time updates on new activity (posts and comments).


### Getting Started

**Let us know that you’re ready to get started by replying to the email you’ve received about this step.** Once you’ve done that you will receive an invite to a GitLab repository from which you should clone the repo, do your work, and push when you’re done.

### Evaluation

- Full implementation of provided requirements.
- Well structured, clean and readable code.
- Unit-tests for required end-points.
- Properly outlined DB scheme.


### Submission

Please organize, test and document your code as if it were going into production. Also include detailed instructions on how to build and serve your code;  finally push your changes to the master branch. After you have pushed your code, let us know so we can review your work, **if you won’t let us know you’re done we won’t know we should start testing.**

All the best and good luck!

The Vett.io Team.