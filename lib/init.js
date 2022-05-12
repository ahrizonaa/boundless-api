import { config } from 'dotenv';
import * as path from 'path';

const local = process.cwd().indexOf('girlcodeapps-workspace') != -1;
const envfile = local ? '.env' : 'gcloud.env';
config({ path: path.join(process.cwd(), '..', envfile) });

export { local };
