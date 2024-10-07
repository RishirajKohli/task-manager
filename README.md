## TASK MANAGER SERVICE

This service enables users to create new task items and track them. Users can mark their tasks as completed once done.

It uses JWT for authentication, Bcrypt for password hashing, MongoDB for data storage, SendGrid for sending emails, Jest & Supertest for API testing.

### Installation Guide

1. Install Node.js 20.x
2. Clone this repository and cd into it.
3. Run `npm install` to install the dependencies.
4. Populate dev.env and test.env files inside "config" folder to configure values for URLs and passwwords. Check sample.env file for the environment variable names.

### Local Development

1. Run `npm run dev` to run the development server on localhost.

### Testing

1. Run `npm run test` to execute all the test cases
