import ImageKit from 'imagekit';

var imagekitclient = new ImageKit({
	publicKey: process.env.imagekit_publickey,
	privateKey: process.env.imagekit_privatekey,
	urlEndpoint: process.env.imagekit_endpoint,
});

export { imagekitclient };
