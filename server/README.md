## To Configure the Environment

The .env file must be located in the config/ directory, and you must add the following keys to run the app correctly:

-    PORT (optional): The port used by Express to listen for requests. If not specified, the default port is 3000.

-    DB_URL: The URL for connecting to the MongoDB database.

-    JWT_SECRET: The secret key used for signing tokens in JWT.


## Install dependencies

```bash
$ npm install
```


## Run the app

```bash
$ npm start
```

## Build documentation

```bash
$ npm run docs
```

## Clean documentation
```bash
$ npm run clean-docs
```

## Run test

```bash
$ npm run test
```