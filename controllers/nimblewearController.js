import { Controller } from './controller.js';

export class NimblewearController extends Controller {
	constructor(mongoClient, dbName) {
		super(mongoClient, dbName);

		this.get('/home', async (req, res) => {
			res.status(200).send('Nimbelwear API is online');
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
