# Authentication-Server

A server that can be use as alternative for authenticate user.

For env configuration please check the .env.example file.

## Migrations

To run the migration move to src directory and run `knex migrate:latest`. It'll run all the migrations and create the tables in database.

## Seeds or dummy data

To run the seeds move to src directory and run `knex seed:run`. It'll add some dummy data to database.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the dev mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser. Since 

### Note: 

1. This project uses babel for compiling the code to JS we need to run `npm run build:watch` side by side to keep track of all the files changes in src folder     because babel does not listen to file changes.

2. Babel does not support perameter decorators we recommend using `tsc` for compilation. 

### `npm start`

Runs the app in the prod mode.<br />

### `npm run build`
 
To compile the Typescript into JavaScript.

### `npm run build:watch`

To compile and keep track of all the file changes in src folder.

# API

## Available GraphQL API

### `SignInWithUsernameAndPassword` 

Signin the user with email/username and password. It take two argument username and password and return a token and timestamp.

### `RegisterWithUsernameAndPassword` 

Create a new user with email/username and password. It take two argument username and password and return a token and timestamp.

### `IsAuthenticated` 

It tell if provided token is valid or not, return true if valid otherwise false.

### `ChangePassword` 

Change the user account password. Take two argument old password and new password and return true if successful otherwise false.
