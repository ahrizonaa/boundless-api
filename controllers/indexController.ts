import { MongoClient } from 'mongodb';
import { Controller } from './controller.js';
import { Request, Response } from 'express';

class IndexController extends Controller {
	constructor(c: MongoClient, d: string) {
		super(c, d);
		this.router.get('/', (req: Request, res: Response) => {
			res.sendFile(process.cwd() + '/public/index.html');
		});
	}
}

export { IndexController };
