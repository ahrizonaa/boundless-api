import { Controller } from './controller.js';
import { ObjectId } from 'mongodb';

export class JollofController extends Controller {
	constructor(c, d) {
		super(c, d);

		this.get('/home', async (req, res) => {
			res.status(200).send('Jollof Web API is online and ready.');
			// try {
			// 	let perkCollection = this.db.collection('Perks');

			// 	let perks = await perkCollection.find({}).toArray();

			// 	res.status(200).send(perks);
			// } catch (exception) {
			// 	res.status(500).send(exception.message);
			// }
		});

		this.post('/log', async (req, res) => {
			try {
				let result = await this.logger.log(req.body);
				res.status(200).send(result);
			} catch (exception) {
				res.status(500).send(exception.message);
			}
		});

		this.get('/google/appsettings', async (req, res) => {
			this.logger.info({
				data: {
					url: '/appsettings',
					client_id: process.env.google_client_id_jollof
				}
			});
			res.send({ client_id: process.env.google_client_id_jollof });
		});

		this.post('/createuser', async (req, res) => {
			try {
				let data = await this.db.collection('Users').insertOne(req.body);
				res.send(data);
			} catch (err) {
				res.status(500).send(err.message);
			}
		});

		this.post('/finduser', async (req, res) => {
			try {
				let userAccount = await this.db
					.collection('Users')
					.findOne({ email: req.body.email });

				res.send({ userAccount });
			} catch (err) {
				res.status(500).send(err.message);
			}
		});

		// this.post('/accept', async (req, res) => {
		// 	try {
		// 		await this.twilio.messages
		// 			.create({
		// 				body: `${req.body.user} has requested perk ${req.body.perk.name}`,
		// 				to: process.env.perks_contact,
		// 				from: process.env.TWILIO_PHONE_NUMBER
		// 			})
		// 			.then((msg) => {
		// 				res.status(200).send(msg);
		// 			});
		// 	} catch (exception) {
		// 		res.status(500).send(exception.message);
		// 	}
		// });
	}
}
