const SCOPES = ['repo', 'read:user', 'user:email'];

function getSiteOrigin(request: Request): string {
	const configured = process.env.SITE_URL ?? process.env.URL;
	if (configured) return configured.replace(/\/$/, '');

	const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
	const protocol = request.headers.get('x-forwarded-proto') ?? 'https';
	return `${protocol}://${host}`;
}

export default {
	async fetch(request: Request): Promise<Response> {
		const clientId = process.env.GITHUB_CLIENT_ID;
		if (!clientId) {
			return new Response('Missing GITHUB_CLIENT_ID', { status: 500 });
		}

		const origin = getSiteOrigin(request);
		const redirectUri = `${origin}/api/callback`;
		const params = new URLSearchParams({
			client_id: clientId,
			redirect_uri: redirectUri,
			scope: SCOPES.join(' '),
		});

		return Response.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`, 302);
	},
};
