import { Controller } from './controller.js';
import { ObjectId } from 'mongodb';

export class NimblewearController extends Controller {
	constructor(c, d) {
		super(c, d);

		this.get('/home', (req, res) => {
			res.status(200).send('Not Implemented');
		});

		this.post('/log', async (req, res) => {
			try {
				let res = await this.db.collection('Logs').insertOne(req.body.log);
				res.status(200).send(res);
			} catch (exception) {
				res.status(500).send(exception.message);
			}
		});
	}
}
