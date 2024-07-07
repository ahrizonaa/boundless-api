import { Controller } from './controller.js';
import { MongoClient, ObjectId } from 'mongodb';
import jollofService from '../services/jollofService.js';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { Request, Response } from 'express';
import multer from 'multer';
import { s3Client } from '../lib/s3Client.js';
var upload = multer({ storage: multer.memoryStorage() });

export class JollofController extends Controller {
	constructor() {
		super('Jollof');

		this.router.get('/home', async (req: Request, res: Response) => {
			res.status(200).send('Jollof API is online');
		});
	}
}
