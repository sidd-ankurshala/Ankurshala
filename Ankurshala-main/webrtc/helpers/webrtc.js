const twilio = require('twilio');
require('dotenv').config();

const twilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKeySid = process.env.TWILIO_API_KEY_SID;
  const apiKey = process.env.TWILIO_API_KEY_SECRET;

  if (!accountSid || !apiKey) {
    throw new Error('Twilio account SID or auth token not found');
  }

  return twilio(apiKeySid, apiKey, { accountSid: accountSid });
}

//identity means participants identity
const generateAccessToken = (identity, roomName) => {
  const token = new twilio.jwt.AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    {identity: identity}
  );

  token.identity = identity;

  const videoGrant = new twilio.jwt.AccessToken.VideoGrant({ room: roomName });
  token.addGrant(videoGrant);

  return token.toJwt();
};

module.exports = { twilioClient, generateAccessToken };