import { Controller } from './controller.js';
import { ObjectId } from 'mongodb';

export class NimblewearController extends Controller {
	constructor(c, d) {
		super(c, d);

		this.get('/home', async (req, res) => {
			let result = await this.db.collection('Logs').insertOne({ name: 'test' });
			res.status(200).send(result);
		});

		this.post('/log', async (req, res) => {
			try {
				let result = await this.db.collection('Logs').insertOne(req.body);
				res.status(200).send(result);
			} catch (exception) {
				res.status(500).send(exception.message);
			}
		});
	}
}
