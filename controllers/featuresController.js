import { Controller } from './controller.js';
import { ObjectId } from 'mongodb';

class FeaturesController extends Controller {
	constructor(c, d) {
		super(c, d);

		this.post('/save', async (req, res) => {
			let query = { _id: new ObjectId(req.body._id) };
			let update = { $push: { features: req.body.feature } };

			let result = await this.db.collection('Apps').updateOne(query, update);
			res.send(result);
		});

		this.post('/delete', async (req, res) => {
			let query = { _id: new ObjectId(req.body._id) };
			let deleteElement = { $pull: { features: req.body.feature } };

			let result = await this.db.collection('Apps').updateOne(query, deleteElement);
			res.send(result);
		});
	}
}

export { FeaturesController };
