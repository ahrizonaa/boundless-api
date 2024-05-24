import { Controller } from './controller.js';
import { ObjectId } from 'mongodb';

export class PerksController extends Controller {
	constructor(c, d) {
		super(c, d);

		this.get('/fetch', async (req, res) => {
			try {
				let perkCollection = await this.mongoClient.db(this.dbName).collection('Perks');

				let perks = await perkCollection.find({}).toArray();

				res.status(200).send(perks);
			} catch (exception) {
				res.status(500).send(exception.message);
			}
		});

		this.post('/accept', async (req, res) => {
			try {
				await this.twilio.messages
					.create({
						body: `${req.body.user} has requested perk ${req.body.perk.name}`,
						to: process.env.perks_contact,
						from: process.env.TWILIO_PHONE_NUMBER,
					})
					.then((msg) => {
						res.status(200).send(msg);
					});
			} catch (exception) {
				res.status(500).send(exception.message);
			}
		});
	}
}
