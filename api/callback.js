function getSiteUrl() {
	if (process.env.SITE_URL) {
		return process.env.SITE_URL.replace(/\/$/, '');
	}
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}
	return 'http://localhost:4321';
}

/** @param {import('@vercel/node').VercelRequest} req */
/** @param {import('@vercel/node').VercelResponse} res */
export default async function handler(req, res) {
	const clientId = process.env.GITHUB_CLIENT_ID;
	const clientSecret = process.env.GITHUB_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		res.status(500).send('Missing GitHub OAuth environment variables');
		return;
	}

	const code = typeof req.query.code === 'string' ? req.query.code : req.query.code?.[0];
	if (!code) {
		res.status(400).send('Missing authorization code');
		return;
	}

	const siteUrl = getSiteUrl();
	const redirectUri = `${siteUrl}/api/callback`;

	const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			code,
			redirect_uri: redirectUri,
		}),
	});

	const data = await tokenResponse.json();

	if (!data.access_token) {
		const message = data.error_description ?? data.error ?? 'OAuth token exchange failed';
		res.status(401).send(message);
		return;
	}

	const token = JSON.stringify(data.access_token);

	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.status(200).send(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><title>Authorizing…</title></head>
<body>
<script>
(function () {
  var token = ${token};
  if (window.opener) {
    window.opener.postMessage(
      'authorization:github:success:' + JSON.stringify({ token: token, provider: 'github' }),
      '*'
    );
    window.close();
  } else {
    document.body.innerHTML = '<p>Autorización completada. Cierra esta ventana y vuelve a /admin/</p>';
  }
})();
</script>
</body>
</html>`);
}
