require('dotenv').config()
const otp = require("./otp")


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

function main() {
    client.messages
        .create({
            body: 'Your otp for phone number verification is ' + otp,
            from: '+14696207863',
            to: '+919497657092'
        })
        .then(message => console.log(message.sid))
        .catch((err) => console.log(err));
}

module.exports = main()