function getSiteUrl() {
	if (process.env.SITE_URL) {
		return process.env.SITE_URL.replace(/\/$/, '');
	}
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}
	return 'http://localhost:4321';
}

/** @param {import('@vercel/node').VercelRequest} _req */
/** @param {import('@vercel/node').VercelResponse} res */
export default function handler(_req, res) {
	const clientId = process.env.GITHUB_CLIENT_ID;
	if (!clientId) {
		res.status(500).send('Missing GITHUB_CLIENT_ID');
		return;
	}

	const siteUrl = getSiteUrl();
	const redirectUri = `${siteUrl}/api/callback`;
	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		scope: 'repo read:user user:email',
	});

	res.redirect(302, `https://github.com/login/oauth/authorize?${params.toString()}`);
}
