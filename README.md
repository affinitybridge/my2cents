# Project Codename

Project Codename connects individuals with their elected representatives.

Create web widgets with localized lists of representatives. Call them at the
touch of a button.

## Heroku environment variables

Create a `.env` file in the root of the project with the following content:

    NODE_ENV=development
    APP_URL=http://localhost:5000
    TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    TWILIO_TOKEN=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
    TWILIO_APP_SID=APzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
    TWILIO_CALLER_ID=+15555555555
    DEMO_NUMBER=+16666666666
    DEMO_MODE={YES,NO}
    SALT={random string. see https://gist.github.com/2951303 to generate}
    SESSION_SECRET={random string. see https://gist.github.com/2951303 to generate}

`DEMO_MODE` and `DEMO_NUMBER` are optional.

When `DEMO_MODE` is set to `YES`, no phone call will be made and the web site
user will hear a "currently unavailable" message.

When `DEMO_NUMBER` is present, this number will be dialled instead of the
requested number.

## Running the application

Use `foreman` to run the app. You can install [foreman](https://github.com/ddollar/foreman) with the following command.

    gem install foreman

Run the app with the following command:

    foreman start

## Build tools

[Jake](https://github.com/mde/jake/#jake----javascript-build-tool-for-nodejs) is used to help with the build.

Install `jake` with the following command:

    npm install -g jake

[Docco](http://jashkenas.github.com/docco/) is used for building documentation.

Install `docco` with the following command:

    easy_install Pygments
    npm install -g docco

To run all build commands simple run `$ jake` from the project root.

To lint the code run `$ jake lint`

To only build the docs run `$ jake docs`

## Tests

[Mocha](http://visionmedia.github.com/mocha/) is used for testing.

To run the tests run either of the following commands:

    make test
    npm test

## TODO

- add DB backend
- make the TWILIO_* environment variables part of the campaign model
- add campaign creation/update/delete forms
- user authentication/sign-up/login
- statistics
- investigate client-side calls to the represent API
- UI design
- debate the use of knockoutjs or something similar for client-side behaviour
- investigate use of tel:// protocol for mobile devices
