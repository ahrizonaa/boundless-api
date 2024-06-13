import { Controller } from './controller.js';

class IndexController extends Controller {
	constructor(c, d) {
		super(c, d);
		this.get('/', (req, res) => {
			let host = req.get('host');
			let origin = req.get('origin');
			console.log({
				host,
				origin
			});
			res.sendFile(process.cwd() + '/public/index.html');
		});
	}
}

export { IndexController };
