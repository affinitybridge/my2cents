# Project Codename

Create a .env file with the following content

    TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    TWILIO_TOKEN=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
    TWILIO_APP_SID=APzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
    TWILIO_CALLER_ID=+15555555555

and run it with <code>foreman start</code>. If you do not have foreman yet,
install it with <code>gem install foreman</code> and
[read about it](https://github.com/ddollar/foreman).

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
