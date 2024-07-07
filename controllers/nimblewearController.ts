import { Controller } from './controller.js';

export class NimblewearController extends Controller {
	constructor() {
		super('NimbelWear');

		this.router.get('/home', async (req, res) => {
			res.status(200).send('Nimbelwear API is online');
		});
	}
}
