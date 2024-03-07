import { Controller } from './controller.js';
import { VerifyGoogleUser, SyncUserWithDB } from '../lib/lib-google.js';

class GoogleSignInController extends Controller {
	constructor(c, d) {
		super(c, d);

		this.post('/login', async (req, res) => {
			this.logger.info({
				data: {
					url: '/login'
				}
			});
			let googleprofile = await VerifyGoogleUser(req.body.code);
			this.logger.info({
				data: {
					googleprofile: googleprofile
				}
			});
			if (googleprofile.error) {
				res.send(googleprofile);
				return;
			}

			let response = await SyncUserWithDB(googleprofile);
			response.code = req.body.code;

			res.send(response);
		});

		this.get('/appsettings', async (req, res) => {
			this.logger.info({
				data: {
					url: '/appsettings',
					client_id: process.env.client_id
				}
			});
			res.send({ client_id: process.env.client_id });
		});
	}
}

export { GoogleSignInController };
