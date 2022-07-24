# Pariti_assignment

Build a basic vending machine class

Statement of work found [here](./docs/Statement-of-work.md).

Functional & Non-Functional Requirements found [here](./docs/Requirements.md).

UML designs found [here](./docs/uml/)

## Dependencies:

Install these dependencies on your local machine:

- [Docker](https://hub.docker.com/) ^20.10.16
- [Node](https://nodejs.org/en/) ^16.14.0
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) ^8.5.1

## Instructions

1. Change directory into `vending_machine` after unzipping
   ```
    $ cd vending_machine
   ```
2. Build the Vending Machine image using docker [Docker](https://hub.docker.com/)
   ```
    $ docker build -t vending-machine:1.0.0 .
   ```
3. Run a container instance of the Vending Machine image
   ```
    $ docker run -p 3000:3000 vending-machine:1.0.0
   ```
4. Copy the contents in [openAPI](./openapi.yaml) & paste it to [swagger editor](https://editor.swagger.io/) using an
   open api viewer tool & manually test the endpoints in the documentation using a
   tool like [postman](https://www.postman.com/downloads/).

## Running the tests locally

1. Install dependencies on your machine

```
$ cd vending_machine
$ npm install
```

2. Run the tests

```
$ npm run test:ci
```
