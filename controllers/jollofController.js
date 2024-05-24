import { Controller } from './controller.js';
import { ObjectId } from 'mongodb';

export class JollofController extends Controller {
	constructor(mongoClient, dbName) {
		super(mongoClient, dbName);

		this.get('/home', async (req, res) => {
			res.status(200).send('Jollof Web API is online and ready.');
		});

		this.post('/log', async (req, res) => {
			try {
				let result = await this.logger.log(req.body);
				res.status(200).send(result);
			} catch (exception) {
				res.status(500).send(exception.message);
			}
		});

		this.post('/createuser', async (req, res) => {
			try {
				let data = await this.mongoClient
					.db(this.dbName)
					.collection('Users')
					.insertOne(req.body);
				res.send(data);
			} catch (err) {
				res.status(500).send(err.message);
			}
		});

		this.post('/finduser', async (req, res) => {
			try {
				let userAccount = await this.mongoClient
					.db(this.dbName)
					.collection('Users')
					.findOne({ 'user.email': req.body.email });
				res.send({ userAccount });
			} catch (err) {
				res.status(500).send(err.message);
			}
		});

		this.get('/appsettings', async (req, res) => {
			let settings = {
				googleClientId: process.env.JOLLOF_GOOGLE_CLIENT_ID,
				facebookAppId: process.env.JOLLOF_FACEBOOK_APP_ID
			};

			this.logger.info({
				data: {
					url: '/appsettings',
					settings
				}
			});
			res.send(settings);
		});
	}
}
