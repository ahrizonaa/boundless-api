import { Controller } from './controller.js';
import fetch from 'node-fetch';
export class VisionController extends Controller {
    constructor(c, d) {
        super(c, d);
        this.router.post('/textdetection', async (req, res) => {
            try {
                let imgBase64Str = req.body.imgBase64Str;
                let httpResponse = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_CLOUD_API_KEY}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        requests: [
                            {
                                image: {
                                    content: imgBase64Str,
                                },
                                features: [
                                    {
                                        type: 'TEXT_DETECTION',
                                    },
                                ],
                            },
                        ],
                    }),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                });
                let googleOCRResponse = await httpResponse.json();
                res.status(200).send(googleOCRResponse);
            }
            catch (exception) {
                res.status(500).send(exception);
            }
        });
    }
}
