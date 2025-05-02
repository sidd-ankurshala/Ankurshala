const twilio = require("twilio");
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const twilioConfig = {
  accountSid: "your_account_sid",
  apiKey: "your_api_key",
  apiSecret: "your_api_secret",
};

module.exports = {
  generateToken: (identity, roomName) => {
    try {
      // Create a new Access Token
      const token = new AccessToken(
        twilioConfig.accountSid,
        twilioConfig.apiKey,
        twilioConfig.apiSecret,
        { ttl: 3600 } // Token validity in seconds
      );

      // Assign identity to the token
      token.identity = identity;

      // Add a Video Grant to the token
      const videoGrant = new VideoGrant({ room: roomName });
      token.addGrant(videoGrant);

      // Return the JWT token
      return token.toJwt();
    } catch (error) {
      throw new Error(`Error generating Twilio token: ${error.message}`);
    }
  },
};
