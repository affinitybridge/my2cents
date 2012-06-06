# Project Codename

Create a .env file with the following content

    NODE_ENV=development
    TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    TWILIO_TOKEN=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
    TWILIO_APP_SID=APzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
    TWILIO_CALLER_ID=+15555555555
    DEMO_NUMBER=+16666666666
    DEMO_UNARMED_YES_NO={YES,NO}

and run it with <code>foreman start</code>. If you do not have foreman yet,
install it with <code>gem install foreman</code> and
[read about it](https://github.com/ddollar/foreman).

The two environment variables <code>DEMO_NUMBER</code> and
<code>DEMO_UNARMED_YES_NO</code> are optional.

When <code>DEMO_NUMBER</code> is present, this number will be dialled instead
of the requested number.

When <code>DEMO_UNARMED_YES_NO</code> is set to <code>YES</code>, no phone call
will be made and the web site user will hear a "currently unavailable" message.

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
