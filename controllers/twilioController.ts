import { Controller } from './controller.js';
import { MongoClient, ObjectId } from 'mongodb';

export class TwilioController extends Controller {
	constructor(c: MongoClient, d: string) {
		super(c, d);

		this.router.post('/coderequest', async (req, res) => {
			try {
				let code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
				let textmsg = `${code} is your security code from Charmee`;
				await this.twilio.messages
					.create({
						body: textmsg,
						to: req.body.tel,
						from: process.env.TWILIO_PHONE_NUMBER,
					})
					.then((msg: { code: number; }) => {
						msg.code = code;
						res.status(200).send(msg);
					});
			} catch (exception) {
				res.status(500).send(exception);
			}
		});
	}
}
