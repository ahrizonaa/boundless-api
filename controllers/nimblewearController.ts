import { MongoClient } from 'mongodb';
import { Controller } from './controller.js';

export class NimblewearController extends Controller {
	constructor(mongoClient: MongoClient, dbName: string) {
		super(mongoClient, dbName);

		this.router.get('/home', async (req, res) => {
			res.status(200).send('Nimbelwear API is online');
		});

		this.router.post('/log', async (req, res) => {
			try {
				let result = await this.logger.log(req.body);
				res.status(200).send(result);
			} catch (err: any) {
				res.status(500).send(err.message);
			}
		});
	}
}
