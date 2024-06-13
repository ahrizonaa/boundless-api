import { Controller } from './controller.js';

export class NimblewearController extends Controller {
	constructor(mongoClient, dbName) {
		super(mongoClient, dbName);

		this.get('/', (req, res) => {
			let host = req.get('host');
			let origin = req.get('origin');
			let data = {
				host,
				origin
			};
			console.log(data);
			res.status(200).send(data);
		});

		this.get('/nimbelwear', (req, res) => {
			let host = req.get('host');
			let origin = req.get('origin');
			let data = {
				host,
				origin
			};
			console.log(data);
			res.status(200).send(data);
		});

		this.get('/home', async (req, res) => {
			let result = await this.mongoClient
				.db(this.dbName)
				.collection('Logs')
				.insertOne({ name: 'test' });
			res.status(200).send(result);
		});

		this.post('/log', async (req, res) => {
			try {
				let result = await this.logger.log(req.body);
				res.status(200).send(result);
			} catch (exception) {
				res.status(500).send(exception.message);
			}
		});
	}
}
