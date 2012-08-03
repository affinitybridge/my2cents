# My2Cents

My2Cents connects individuals with their elected representatives.

Create web widgets with localized lists of representatives. Call them at the
touch of a button.

Developed to run on [Heroku](http://heroku.com).

## Create a Heroku account

Create an account on [Heroku](http://heroku.com). It would be helpful to be
familiar with the [documentation on using Node.js](https://devcenter.heroku.com/articles/nodejs).

## Create a Twilio app

Create a new [Twilio](http://twilio.com) app and note your account SID and token, the app SID, and your
phone number.

## Development Heroku environment variables

Create a `.env` file in the root of the project with the following content:

    APP_URL=http://localhost:5000
    DEMO_MODE={YES,NO}
    DEMO_NUMBER=+15555555550
    NODE_ENV=development
    SALT=keyboard cat
    SESSION_SECRET=keyboard cat
    TWILIO_APP_SID=APxxxxxxxxxxxxxxxxxxxx
    TWILIO_CALLER_ID=+15555555555
    TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxx
    TWILIO_TOKEN=xxxxxxxxxxxxxxxxxxxx

`DEMO_MODE` and `DEMO_NUMBER` are optional.

When `DEMO_MODE` is set to `YES`, no phone call will be made and the web site
user will hear a "currently unavailable" message.

When `DEMO_NUMBER` is present, this number will be dialled instead of the
requested number.

## Production Heroku environment variables

Set the following config variables on heroku using the command `heroku config add KEY:VALUE`

    APP_URL          => http://example.herokuapp.com
    DEMO_MODE        => NO
    DEMO_NUMBER      => +15555555555
    NODE_ENV         => production
    SALT={random string. see https://gist.github.com/2951303 to generate}
    SESSION_SECRET={random string. see https://gist.github.com/2951303 to generate}
    TWILIO_APP_SID   => APxxxxxxxxxxxxxxxxxxxx
    TWILIO_CALLER_ID => +15555555550
    TWILIO_SID       => ACxxxxxxxxxxxxxxxxxxxx
    TWILIO_TOKEN     => xxxxxxxxxxxxxxxxxxxx

Add the free MongoLab Heroku addon to your account with the following command:

    heroku addons:add mongolab:starter

## Running the application

Use `foreman` to run the app locally. You can install [foreman](https://github.com/ddollar/foreman) with the following command.

    gem install foreman

Run the app with the following command:

    foreman start

You will need a running [MongoDB](http://www.mongodb.org/) instance for the app to operate.

## Deploying the application

    git push heroku master

## Build tools

[Jake](https://github.com/mde/jake/#jake----javascript-build-tool-for-nodejs) is used to help with the build.

Install `jake` with the following command:

    npm install -g jake

[Docco](http://jashkenas.github.com/docco/) is used for building documentation.

Install `docco` with the following command:

    easy_install Pygments
    npm install -g docco

To run all build commands run `$ jake` from the project root.

To lint the code run `$ jake lint`

To only build the docs run `$ jake docs`

## Tests

[Mocha](http://visionmedia.github.com/mocha/) is used for testing.

To run the tests run either of the following commands:

    make test
    npm test

## License

My2Cents is MIT licensed. See the [LICENSE](http://github.com/affinitybridge/my2cents/raw/master/LICENSE) file.

## Contributors

* [Shawn Price](https://twitter.com/sprice)
* Raphael Huefner

## TODO

- Improve UX/UI
- make the TWILIO_* environment variables part of the campaign model
- add campaign creation/update/delete forms
- Statistics
- Should we use a client side JS library/call Represent API from client?
- Use `tel://` protocol for mobile devices
