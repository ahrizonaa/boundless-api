import { Controller } from './controller.js';
import { ObjectId } from 'mongodb';

class AppsController extends Controller {
	constructor(c, d) {
		super(c, d);

		this.post('/fetch', async (req, res) => {
			try {
				let apps = this.db.collection('Apps');

				const agg = [
					{
						$match: {
						  'originator': new ObjectId(req.body.userid)
						}
					},
					{
						$lookup: {
							from: 'Users',
							localField: 'originator',
							foreignField: '_id',
							as: 'originator',
						},
					},
					{
						$lookup: {
							from: 'Users',
							localField: 'collaborators',
							foreignField: '_id',
							as: 'c',
						},
					},
				];

				let result = await apps.aggregate(agg).toArray();

				res.status(200).send(result);
			} catch (exception) {
				res.status(500).send(exception.message);
			}
		});

		this.post('/save', async (req, res) => {
			try {
				let result = await this.db.collection('Apps').insertOne({
					name: req.body.name,
					originator: new ObjectId(req.body.originator),
					features: req.body.features,
					timeline: req.body.timeline,
				});
				res.status(200).send(result);
			} catch (exception) {
				res.status(500).send(exception);
			}
		});

		this.delete('/delete', async (req, res) => {
			try {
				let query = { _id: new ObjectId(req.body._id) };
				let deletedCount = (await this.db.collection('Apps').deleteOne(query)).deletedCount;

				let appCollection = this.db.collection('Apps');

				const agg = [
					{
						$lookup: {
							from: 'Users',
							localField: 'originator',
							foreignField: '_id',
							as: 'originator',
						},
					},
					{
						$lookup: {
							from: 'Users',
							localField: 'collaborators',
							foreignField: '_id',
							as: 'c',
						},
					},
				];

				let apps = await appCollection.aggregate(agg).toArray();

				res.status(200).send({ deletedCount, apps });
			} catch (exception) {
				res.status(500).send(exception);
			}
		});

		this.post('/timeline/initiate', async (req, res) => {
			try {
				let query = { _id: new ObjectId(req.body.app._id) };
				let event = {};
				event[`timeline.${req.body.eventindex}.inProgress`] = true;

				let update = { $set: event };

				let result = await this.db.collection('Apps').updateOne(query, update);
				res.status(200).send(result);
			} catch (exception) {
				res.status(500).send(exception);
			}
		});

		this.post('/timeline/complete', async (req, res) => {
			try {
				let query = { _id: new ObjectId(req.body.app._id) };
				let event = {};
				event[`timeline.${req.body.eventindex}.inProgress`] = false;
				event[`timeline.${req.body.eventindex}.isDone`] = true;

				let update = { $set: event };

				let result = await this.db.collection('Apps').updateOne(query, update);
				res.status(200).send(result);
			} catch (exception) {
				res.status(500).send(exception);
			}
		});

		this.post('/features/save', async (req, res) => {
			try {
				let query = { _id: new ObjectId(req.body._id) };
				let update = { $push: { features: req.body.feature } };

				let result = await this.db.collection('Apps').updateOne(query, update);
				res.status(200).send(result);
			} catch (exception) {
				res.status(500).send(exception);
			}
		});

		this.post('/features/delete', async (req, res) => {
			try {
				let query = { _id: new ObjectId(req.body._id) };
				let deleteElement = { $pull: { features: req.body.feature } };

				let result = await this.db.collection('Apps').updateOne(query, deleteElement);
				res.send(result);
			} catch (exception) {
				res.status(500).send(exception);
			}
		});
	}
}

export { AppsController };
