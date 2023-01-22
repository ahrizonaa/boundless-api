import { Controller } from './controller.js';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

class UserController extends Controller {
	constructor(c, d) {
		super(c, d);

		this.post('/fetch', async (req, res) => {
			try {
				let result = await this.db
					.collection('Users')
					.findOne({ _id: new ObjectId(req.body._id) });

				res.status(200).send(result);
			} catch (exception) {
				res.status(500).send(exception);
			}
		});

		this.post('/exists', async (req, res) => {
			try {
				let search = await this.db.collection('Users').findOne({ tel: req.body.tel });
				res.status(200).send(search);
			} catch (exception) {
				res.status(500).send(exception);
			}
		});

		this.post('/validate', async (req, res) => {
			try {
				let query = { _id: new ObjectId(req.body._id) };
				let update = { $set: { validatedon: req.body.validatedon } };

				let result = await this.db.collection('Users').updateOne(query, update);

				res.status(200).send(result);
			} catch (exception) {
				res.status(500).send(exception);
			}
		});

		this.post('/requestcode', async (req, res) => {
			let code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
			let textmsg = `${code} is your security code from Charmee`;
			await this.twilio.messages
				.create({
					body: textmsg,
					to: req.body.tel,
					from: process.env.TWILIO_PHONE_NUMBER,
				})
				.then((msg) => {
					msg.code = code;
					res.send(msg);
				});
		});

		this.post('/create', async (req, res) => {
			try {
				req.body.settings['bgindex'] = 2;
				let result = await this.db.collection('Users').insertOne({
					tel: req.body.tel,
					displayname: req.body.displayname,
					validatedon: req.body.validatedon,
					settings: req.body.settings,
				});

				res.status(200).send(result);
			} catch (exception) {
				res.status(500).send(exception);
			}
		});

		this.put('/displayname', async (req, res) => {
			try {
				let query = { _id: new ObjectId(req.body._id) };
				let update = { $set: { displayname: req.body.displayname } };

				let result = await this.db.collection('Users').updateOne(query, update);
				res.status(200).send(result);
			} catch (exception) {
				res.status(500).send(exception);
			}
		});

		this.post('/perk', async (req, res) => {
			try {
				let userCollection = this.db.collection('Users');

				let query = {
					_id: new ObjectId(req.body._id),
				};

				let u = {
					perks: {
						skdfjhi1u3: {
							name: 'microsoft office',
						},
					},
				};

				let obj = {};
				let key = `perks.${req.body.perk._id}`;
				req.body.perk.accepted = true;
				obj[key] = req.body.perk;

				let update = { $set: obj };

				let perks = await userCollection.updateOne(query, update);

				res.status(200).send(perks);
			} catch (exception) {
				res.status(500).send(exception.message);
			}
		});

		this.post('/profilepic', async (req, res) => {
			var uploadOptions = {
				file: req.body.base64String,
				fileName: `${uuidv4()}.png`,
				folder: '/mdyea/profilepics',
			};

			try {
				this.imagekitclient.upload(uploadOptions, (imgkiterr, imgkitres) => {
					if (imgkiterr) {
						res.status(500).send(imgkiterr);
					} else {
						let urlOptions = { src: imgkitres.url };
						let imgHostingUrl = this.imagekitclient.url(urlOptions);
						res.status(200).send({ imgHostingUrl: imgHostingUrl });
					}
				});
			} catch (exception) {
				res.status(500).send({
					error: exception,
					msg: exception.message,
				});
			}
		});
	}
}

export { UserController };
