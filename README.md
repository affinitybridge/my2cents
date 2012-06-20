# Project Codename

Create a .env file with the following content

    NODE_ENV=development
    APP_URL=http://localhost:5000
    TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    TWILIO_TOKEN=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
    TWILIO_APP_SID=APzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
    TWILIO_CALLER_ID=+15555555555
    DEMO_NUMBER=+16666666666
    DEMO_MODE={YES,NO}
    SALT={random string. see https://gist.github.com/2951303 to generate}

and run it with <code>foreman start</code>. If you do not have foreman yet,
install it with <code>gem install foreman</code> and
[read about it](https://github.com/ddollar/foreman).

The two environment variables <code>DEMO_NUMBER</code> and
<code>DEMO_MODE</code> are optional.

When <code>DEMO_NUMBER</code> is present, this number will be dialled instead
of the requested number.

When <code>DEMO_MODE</code> is set to <code>YES</code>, no phone call
will be made and the web site user will hear a "currently unavailable" message.

# Generate docs

Install [docco](http://jashkenas.github.com/docco/) and it's dependencies like
so:

    easy_install Pygments
    npm install -g docco

Update docs:

    docco app.js

# TODO

- add DB backend
- make the TWILIO_* environment variables part of the campaign model
- add campaign creation/update/delete forms
- user authentication/sign-up/login
- statistics
- investigate client-side calls to the represent API
- UI design
- debate the use of knockoutjs or something similar for client-side behaviour
- investigate use of tel:// protocol for mobile devices
