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
export default function handler(req, res) {
	const clientId = process.env.GITHUB_CLIENT_ID;
	if (!clientId) {
		res.status(500).send('Missing GITHUB_CLIENT_ID');
		return;
	}

	const provider = typeof req.query.provider === 'string' ? req.query.provider : req.query.provider?.[0] ?? 'github';
	const scope =
		(typeof req.query.scope === 'string' ? req.query.scope : req.query.scope?.[0]) ??
		'repo read:user user:email';

	const siteUrl = getSiteUrl();
	const redirectUri = `${siteUrl}/api/callback`;
	const githubUrl = `https://github.com/login/oauth/authorize?${new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		scope,
	}).toString()}`;

	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.status(200).send(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><title>Authorizing…</title></head>
<body>
<script>
(function () {
  var provider = ${JSON.stringify(provider)};
  var githubUrl = ${JSON.stringify(githubUrl)};
  var origin = ${JSON.stringify(siteUrl)};
  var authMessage = 'authorizing:' + provider;

  function goToGitHub() {
    window.location.replace(githubUrl);
  }

  function onEcho(event) {
    if (event.data !== authMessage) return;
    window.removeEventListener('message', onEcho);
    goToGitHub();
  }

  window.addEventListener('message', onEcho);

  try {
    var channel = new BroadcastChannel('decap_github_oauth');
    channel.onmessage = function (event) {
      if (event.data !== authMessage) return;
      channel.close();
      goToGitHub();
    };
  } catch (error) {
    /* BroadcastChannel unavailable */
  }

  if (window.opener && !window.opener.closed) {
    try {
      window.opener.postMessage(authMessage, origin);
      return;
    } catch (error) {
      /* fall through */
    }
  }

  try {
    var outbound = new BroadcastChannel('decap_github_oauth');
    outbound.postMessage(authMessage);
    outbound.close();
  } catch (error) {
    goToGitHub();
  }
})();
</script>
</body>
</html>`);
}
