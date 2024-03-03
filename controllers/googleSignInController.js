import { Controller } from './controller.js';
import { VerifyGoogleUser } from '../lib/lib-google.js';

class GoogleSignInController extends Controller {
	constructor(c, d) {
		super(c, d);

		this.post('/login', async (req, res) => {
			let googleprofile = await VerifyGoogleUser(req.body.code);

			if (googleprofile.error) {
				res.send(googleprofile);
				return;
			}

			let response = await this.SyncUserWithDB(googleprofile);
			response.code = req.body.code;

			res.send(response);
		});

		this.get('/appsettings', async (req, res) => {
			res.send({ client_id: process.env.client_id });
		});
	}

	async SyncUserWithDB(googleprofile) {
		let user = await this.db.collection('Users').findOne({
			'googleprofile.email': googleprofile.email
		});

		if (user == null) {
			let newuser = {
				googleprofile: googleprofile
			};

			let insert = await this.db.collection('Users').insertOne(newuser);

			if (insert.acknowledged) {
				return {
					...newuser,
					_id: insert.insertedId,
					isInsert: true,
					isAuthenticated: true
				};
			} else
				return {
					error: 'Unable to create new user using Google Sign In'
				};
		} else if (user.googleprofile.exp < googleprofile.exp) {
			let refresh = await this.db.collection('Users').updateOne(
				{
					'googleprofile.email': googleprofile.email
				},
				{ $set: { googleprofile: googleprofile } }
			);

			if (refresh.acknowledged) {
				user.isRefresh = true;
				user.isAuthenticated = true;
				user.googleprofile = googleprofile;
				return user;
			}
		} else {
			return {
				...user,
				isRefresh: false,
				isAuthenticated: true
			};
		}
	}
}

export { GoogleSignInController };
