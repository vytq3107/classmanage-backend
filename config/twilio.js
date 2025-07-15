const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendSMS = async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      to,
      from: messagingServiceSid
    });
    console.log('SMS sent:', message.sid);
  } catch (error) {
    // console.error('Error sending SMS:', error);
  }
};

module.exports = {
  sendSMS
};
