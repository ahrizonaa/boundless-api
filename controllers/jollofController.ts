import { Controller } from './controller.js';
import { MongoClient, ObjectId } from 'mongodb';
import jollofService from '../services/jollofService.js';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { Request, Response } from 'express';
import multer from 'multer';
import { s3Client } from '../lib/s3Client.js';
var upload = multer({ storage: multer.memoryStorage() });

export class JollofController extends Controller {
	constructor(mongoClient: MongoClient, dbName: string) {
		super(mongoClient, dbName);

		this.router.get('/home', async (req: Request, res: Response) => {
			res.status(200).send('Jollof API is online');
		});

		this.router.post('/log', async (req: Request, res: Response) => {
			try {
				let result = await this.logger.log(req.body);
				res.status(200).send(result);
			} catch (exception: any) {
				res.status(500).send(exception.message);
			}
		});
	}
}
