import { OAuth2Client } from 'google-auth-library';

import { googleClient } from './client.js';

const client = new OAuth2Client(
	process.env.client_id,
	process.env.client_secret,
	process.env.redirect_uris.replace(/,/g, ' ')
);

async function VerifyGoogleUser(code) {
	try {
		let ticket = await client.verifyIdToken({
			idToken: code,
			audience: process.env.client_id
		});
		let payload = ticket.getPayload();

		VerifyGoogleAudClientId(payload.aud);

		if (IsGoogleExpired(payload.exp)) {
			let tokens = await RequestAccessToken(code);

			let url = await Refresh();

			payload = {
				tokens: tokens,
				refreshUrl: url,
				isRefresh: true,
				tokens: tokens
			};
		}

		return payload;
	} catch ({ message }) {
		return {
			error: message
		};
	}
}

async function Refresh() {
	const refreshUrl = await client.generateAuthUrl({
		access_type: 'offline',
		scope: 'https://www.googleapis.com/auth/userinfo.profile',
		prompt: 'consent'
	});
	return refreshUrl;
}

async function RequestAccessToken(code) {
	let tokens = await client.getToken(code);

	client.setCredentials(tokens);

	return tokens;
}

function VerifyGoogleAudClientId(aud) {
	if (aud === process.env.client_id) {
		return true;
	}
	throw new Error(
		'Google Aud client_id does not match registered client_id.  Token may not be intended for this client.  Authentication fails.'
	);
}

function IsGoogleExpired(epochSeconds) {
	if (Date.now() / 1000 > epochSeconds) {
		return true;
	}
	return false;
}

async function SyncUserWithDB(googleprofile) {
	let user = await googleClient.db('Storage').collection('Users').findOne({
		'googleprofile.email': googleprofile.email
	});

	if (user == null) {
		let newuser = {
			googleprofile: googleprofile
		};

		let insert = await googleClient
			.db('Storage')
			.collection('Users')
			.insertOne(newuser);

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
		let refresh = await googleClient
			.db('Storage')
			.collection('Users')
			.updateOne(
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

export { VerifyGoogleUser, SyncUserWithDB };
