import { MongoClient } from 'mongodb';
import { Controller } from './controller.js';
import { Request, Response } from 'express';
import jollofService from '../services/jollofService.js';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import multer from 'multer';
import { s3Client } from '../lib/s3Client.js';
var upload = multer({ storage: multer.memoryStorage() });
import { ProviderUser, Provider } from '@ahrizona/common/lib/interfaces/IAccountService.js';

class IndexController extends Controller {
	constructor(c: MongoClient, d: string) {
		super(c, d);
		this.router.get('/', (req: Request, res: Response) => {
			res.sendFile(process.cwd() + '/public/index.html');
		});

		this.router.post('/signup', async (req: Request, res: Response) => {
			try {
				let data = await this.mongoClient
					.db(req.query['application'] as string)
					.collection('Users')
					.insertOne(req.body);
				res.send(data);
			} catch (err: any) {
				res.status(500).send(err.message);
			}
		});

		this.router.post('/updateprofile', async (req: Request, res: Response) => {
			try {
				let result = await this.mongoClient
					.db(req.query['application'] as string)
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
			} catch (err: any) {
				res.status(500).send(err.message);
			}
		});

		this.router.post(
			'/uploadphoto',
			upload.single('image'),
			async (req: Request, res: Response) => {
				try {
					let filename =
						req.query['application']?.toString().toLowerCase() +
						'/users/' +
						String(req.body.id) +
						'/profile.png';
					let params: PutObjectCommandInput = {
						Bucket: 'mydea',
						Key: filename,
						Body: req.file!.buffer as Buffer,
						ContentType: req.file!.mimetype,
						ACL: 'public-read'
					};

					let s3Result = await s3Client.send(new PutObjectCommand(params));

					let remoteFileUrl = process.env.SPACES_CDN + '/' + filename;

					let dbResult = await this.mongoClient
						.db(req.query['application']?.toString())
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
				} catch (err: any) {
					res.status(500).send(err.message);
				}
			}
		);

		this.router.post('/unlinksocial', async (req: Request, res: Response) => {
			let setter =
				req.query.provider == 'Google'
					? {
							$set: {
								'user.GoogleUser': null
							}
					  }
					: {
							$set: {
								'user.FacebookUser': null
							}
					  };
			try {
				let result = await this.mongoClient
					.db(req.query['application'] as string)
					.collection('Users')
					.updateOne(
						{
							'user.email': req.body.user.email
						},
						setter
					);
				res.send(result);
			} catch (err: any) {
				res.status(500).send(err.message);
			}
		});

		type UserBody = {
			providerUser: ProviderUser;
			provider: Provider;
		}

		this.router.post('/finduser', async (req: Request<{}, any, UserBody, any, any>, res: Response) => {
			let userSearchResult = null;

			try {
				userSearchResult = await this.mongoClient
					.db(req.query['application'] as string)
					.collection('Users')
					.findOne({ 'user.email': req.body.providerUser.email });

				if (userSearchResult != null) {
					if (
						jollofService.isProviderMismatched(
							req.body.provider,
							userSearchResult
						)
					) {
						let query = { 'user.email': req.body.providerUser.email };
						let update;
						if (req.body.provider == 'Google') {
							update = {
								$set: {
									'user.GoogleUser': req.body.providerUser
								}
							};
							userSearchResult.user.GoogleUser = req.body.providerUser;
						} else {
							update = {
								$set: {
									'user.FacebookUser': req.body.providerUser
								}
							};
							userSearchResult.user.FacebookUser = req.body.providerUser;
						}
						await this.mongoClient
							.db(req.query['application'] as string)
							.collection('Users')
							.updateOne(query, update);
					}
				}
			} catch (err: any) {
				res.status(500).send(err.message).end();
			}
			res.send(userSearchResult);
		});
	}
}

export { IndexController };
