
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken, {
  lazyLoading: true,
});
exports.sendSms = (userNumber, body) => {
  return new Promise((resolve, reject) => {
    client.messages
      .create({
        body: body,
        messagingServiceSid: process.env.TWILIO_SERVICE_ID,
        to: userNumber==="923047024934"?userNumber: '+1'+userNumber,
      })
      .then((message) => {
        console.log(message.sid);
        return res.json({ otp });
      });
    console.log(body)
    resolve();
  });
};
