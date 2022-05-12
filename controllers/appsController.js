import { Controller } from './controller.js';
import { ObjectId } from 'mongodb';

class AppsController extends Controller {
	constructor(c, d) {
		super(c, d);
		this.get('/', async (req, res) => {
			const apps = await this.db.collection('Apps').find({}).toArray();
			res.send(apps);
		});

		this.post('/initiate', async (req, res) => {
			let query = { _id: new ObjectId(req.body._id) };
			let update = { $set: { initiated: true } };

			let result = await this.db.collection('Apps').updateOne(query, update);
			res.send(result);
		});

		this.post('/add', async (req, res) => {
			let result = await this.db.collection('Apps').insertOne({
				name: req.body.name,
				originator: req.body.originator,
				features: req.body.features,
				timeline: req.body.timeline,
			});
			res.send(result);
		});

		this.delete('/delete', async (req, res) => {
			let query = { _id: new ObjectId(req.body._id) };
			let deletedCount = (await this.db.collection('Apps').deleteOne(query)).deletedCount;

			let apps = await this.db.collection('Apps').find({}).toArray();
			res.send({ deletedCount, apps });
		});
	}
}

export { AppsController };
