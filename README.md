### Full-stack Training

#### Pre-requisites

Node v24.4.0
Docker

#### NVM

Switch to the project version of node: `nvm use`
If you don't have the correct version: `nvm install`

#### Setup

Firstly, create a .env file within the `docker/` directory.
It should contain: `POSTGRES_USER=` & `POSTGRES_PASSWORD=`.
These will be used to create the root user on the database.

### Running locally

Install dependencies: `npm install`
Setup database: `npm run start:db`
run: `npm start`
