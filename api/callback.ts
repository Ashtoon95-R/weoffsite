type GitHubTokenResponse = {
	access_token?: string;
	error?: string;
	error_description?: string;
};

function getSiteOrigin(request: Request): string {
	const configured = process.env.SITE_URL ?? process.env.URL;
	if (configured) return configured.replace(/\/$/, '');

	const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
	const protocol = request.headers.get('x-forwarded-proto') ?? 'https';
	return `${protocol}://${host}`;
}

function authSuccessHtml(token: string, origin: string): string {
	const content = JSON.stringify({ token, provider: 'github' });
	return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><title>Authorizing…</title></head>
<body>
<script>
(function () {
  var content = ${content};
  if (window.opener) {
    window.opener.postMessage('authorization:github:success:' + JSON.stringify(content), ${JSON.stringify(origin)});
    window.close();
  }
})();
</script>
<p>Authorization complete. You can close this window.</p>
</body>
</html>`;
}

export default {
	async fetch(request: Request): Promise<Response> {
		const clientId = process.env.GITHUB_CLIENT_ID;
		const clientSecret = process.env.GITHUB_CLIENT_SECRET;
		if (!clientId || !clientSecret) {
			return new Response('Missing GitHub OAuth environment variables', { status: 500 });
		}

		const url = new URL(request.url);
		const code = url.searchParams.get('code');
		if (!code) {
			return new Response('Missing authorization code', { status: 400 });
		}

		const origin = getSiteOrigin(request);
		const redirectUri = `${origin}/api/callback`;

		const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				client_id: clientId,
				client_secret: clientSecret,
				code,
				redirect_uri: redirectUri,
			}),
		});

		const data = (await tokenResponse.json()) as GitHubTokenResponse;
		if (!data.access_token) {
			const message = data.error_description ?? data.error ?? 'OAuth token exchange failed';
			return new Response(message, { status: 401 });
		}

		return new Response(authSuccessHtml(data.access_token, origin), {
			headers: { 'Content-Type': 'text/html; charset=utf-8' },
		});
	},
};
