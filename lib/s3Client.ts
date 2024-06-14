import { S3, S3ClientConfig  } from '@aws-sdk/client-s3';

let endpoint = 'https://nyc3.digitaloceanspaces.com';
let credentials = {
	accessKeyId: process.env.SPACES_KEY,
	secretAccessKey: process.env.SPACES_SECRET
};

let config: S3ClientConfig = {
	forcePathStyle: false, // Configures to use subdomain/virtual calling format.
	endpoint: endpoint,
	region: 'us-east-1',
	credentials: credentials as any
}

const s3Client = new S3(config);

export { s3Client };
