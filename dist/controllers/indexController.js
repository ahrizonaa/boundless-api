import { Controller } from './controller.js';
class IndexController extends Controller {
    constructor(c, d) {
        super(c, d);
        this.router.get('/', (req, res) => {
            res.sendFile(process.cwd() + '/public/index.html');
        });
    }
}
export { IndexController };
