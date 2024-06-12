import { Controller } from './controller.js';
import { ObjectId } from 'mongodb';
import jollofService from '../services/jollofService.js';
import { s3Client } from '../lib/s3Client.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';

import multer from 'multer';

var upload = multer({ storage: multer.memoryStorage() });

export class JollofController extends Controller {
	constructor(mongoClient, dbName) {
		super(mongoClient, dbName);

		this.get('/home', async (req, res) => {
			res.status(200).send('Jollof Web API is online and ready.');
		});

		this.post('/log', async (req, res) => {
			try {
				let result = await this.logger.log(req.body);
				res.status(200).send(result);
			} catch (exception) {
				res.status(500).send(exception.message);
			}
		});

		this.post('/signup', async (req, res) => {
			try {
				let data = await this.mongoClient
					.db(this.dbName)
					.collection('Users')
					.insertOne(req.body);
				res.send(data);
			} catch (err) {
				res.status(500).send(err.message);
			}
		});

		this.post('/updateprofile', async (req, res) => {
			try {
				let result = await this.mongoClient
					.db(this.dbName)
					.collection('Users')
					.updateOne(
						{
							'user.email': req.body.user.email
						},
						{
							$set: {
								'user.profile': req.body.user.profile
							}
						}
					);
				res.send(result);
			} catch (err) {
				res.status(500).send(err.message);
			}
		});

		this.post('/uploadphoto', upload.single('image'), async (req, res) => {
			console.log('body', req.file);
			try {
				let filename = 'jollof/users/' + String(req.body.id) + '/profile.png';
				let params = {
					Bucket: 'mydea',
					Key: filename,
					Body: req.file.buffer,
					ContentType: req.file.mimetype,
					ACL: 'public-read'
				};

				let s3Result = await s3Client.send(new PutObjectCommand(params));

				let remoteFileUrl = process.env.SPACES_CDN + '/' + filename;

				let dbResult = await mongoClient
					.db('Jollof')
					.collection('Users')
					.updateOne(
						{
							'user.email': req.body.email
						},
						{
							$set: {
								'user.profilePhotoUrl': remoteFileUrl
							}
						}
					);
				res.send({
					profilePhotoUrl: remoteFileUrl
				});
			} catch (err) {
				res.status(500).send(err.message);
			}
		});

		this.post('/unlinkgoogle', async (req, res) => {
			try {
				let result = await this.mongoClient
					.db(this.dbName)
					.collection('Users')
					.updateOne(
						{
							'user.email': req.body.user.email
						},
						{
							$set: {
								'user.GoogleUser': null
							}
						}
					);
				res.send(result);
			} catch (err) {
				this.status(500).send(err.message);
			}
		});

		this.post('/unlinkfacebook', async (req, res) => {
			try {
				let result = await this.mongoClient
					.db(this.dbName)
					.collection('Users')
					.updateOne(
						{
							'user.email': req.body.user.email
						},
						{
							$set: {
								'user.FacebookUser': null
							}
						}
					);
				res.send(result);
			} catch (err) {
				this.status(500).send(err.message);
			}
		});

		this.post('/finduser', async (req, res) => {
			let userSearchResult = null;
			try {
				userSearchResult = await this.mongoClient
					.db(this.dbName)
					.collection('Users')
					.findOne({ 'user.email': req.body.user.email });

				if (userSearchResult != null) {
					if (
						jollofService.isProviderMismatched(
							req.body.provider,
							userSearchResult
						)
					) {
						let query = { 'user.email': req.body.user.email };
						let update;
						if (req.body.provider == 'Google') {
							update = {
								$set: {
									'user.GoogleUser': req.body.user
								}
							};
							userSearchResult.user.GoogleUser = req.body.user;
						} else {
							update = {
								$set: {
									'user.FacebookUser': req.body.user
								}
							};
							userSearchResult.user.FacebookUser = req.body.user;
						}
						await this.mongoClient
							.db(this.dbName)
							.collection('Users')
							.updateOne(query, update);
					}
				}
			} catch (err) {
				res.status(500).send(err.message).end();
			}
			res.send(userSearchResult);
		});
	}
}
