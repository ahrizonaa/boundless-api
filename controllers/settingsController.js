import { Controller } from './controller.js';
import { ObjectId } from 'mongodb';

export class SettingsController extends Controller {
	constructor(c, d) {
		super(c, d);

		this.post('/save', async (req, res) => {
			let setting = {
				userId: '',
				darkMode: true,
				theme: 1,
				background: 4,
			};

			let query = { _id: new ObjectId(req.body._id) };
			let update = { $push: { features: req.body.feature } };

			let collection = this.db.collection('Users');

			let fields = Object.keys(req.body);

			let response = {
				modifiedCount: 0,
			};

			for (let i = 0; i < fields.length; i++) {
				let query = { _id: new ObjectId(req.body._id) };
				let property = `settings.${fields[i]}`;
				let settings = {};
				settings[property] = req.body[property];

				let update = { $set: setting };

				let result = await collection.updateOne(query, update);
				response.modifiedCount += result.modifiedCount;
			}

			res.send(response);
		});
	}
}
