// Vercel serverless function. Keeps the Short.io secret key server-side —
// it must never be shipped to the browser (see index.html, which only ever
// calls this endpoint, never api.short.io directly).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.SHORTIO_API_KEY;
  const domain = process.env.SHORTIO_DOMAIN || 'go.akka.app';

  if (!apiKey) {
    res.status(500).json({ error: 'Short.io is not connected yet (missing SHORTIO_API_KEY in Vercel).' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const longUrl = body?.longUrl;
  const path = body?.path;

  if (typeof longUrl !== 'string' || !longUrl) {
    res.status(400).json({ error: 'Missing longUrl' });
    return;
  }

  try {
    const shortioRes = await fetch('https://api.short.io/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
      },
      body: JSON.stringify({
        domain,
        originalURL: longUrl,
        path: path || undefined,
      }),
    });

    const data = await shortioRes.json().catch(() => ({}));

    if (!shortioRes.ok) {
      const message = data?.error === 'This path is already taken'
        ? 'That short link is already in use, try a different name.'
        : (data?.error || 'Short.io rejected the request.');
      res.status(shortioRes.status).json({ error: message });
      return;
    }

    res.status(200).json({ shortURL: data.shortURL });
  } catch (err) {
    res.status(502).json({ error: 'Could not reach Short.io.' });
  }
}
