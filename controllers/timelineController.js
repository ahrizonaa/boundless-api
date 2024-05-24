import { Controller } from './controller.js';
import { ObjectId } from 'mongodb';

class TimelineController extends Controller {
	constructor(c, d) {
		super(c, d);

		this.post('/inprogress', async (req, res) => {
			let query = { _id: ObjectId(req.body.app._id) };

			/*
            event = {
                'timeline.1.inProgress': true
            }
            */
			let event = {};
			event[`timeline.${req.body.eventindex}.inProgress`] = true;

			let update = { $set: event };

			let result = await this.mongoClient
				.db(this.dbName)
				.collection('Apps')
				.updateOne(query, update);
			res.send(result);
		});

		this.post('/isdone', async (req, res) => {
			let query = { _id: ObjectId(req.body.app._id) };

			/*
            event = {
                'timeline.1.inProgress': false,
                'timeline.1.isDone': true
            }
            */
			let event = {};
			event[`timeline.${req.body.eventindex}.inProgress`] = false;
			event[`timeline.${req.body.eventindex}.isDone`] = true;

			let update = { $set: event };

			let result = await this.mongoClient
				.db(this.dbName)
				.collection('Apps')
				.updateOne(query, update);
			res.send(result);
		});
	}
}

export { TimelineController };
