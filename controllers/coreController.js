import { Controller } from './controller.js';

class CoreController extends Controller {
	constructor(mongoClient, dbName) {
		super(mongoClient, dbName);

		this.get('/config', async (req, res) => {
			let googleEnvVar = `${req.query.appName.toUpperCase()}_GOOGLE_CLIENT_ID`;
			let facebookEnvVar = `${req.query.appName.toUpperCase()}_FACEBOOK_APP_ID`;
			let settings = {
				googleClientId: process.env[googleEnvVar],
				facebookAppId: process.env[facebookEnvVar]
			};

			this.logger.info({
				data: {
					url: '/config',
					settings
				}
			});
			res.send(settings);
		});
	}
}

export { CoreController };
