import * as twilio from 'twilio';

const twilioclient = new twilio.default(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN
);

export { twilioclient };
