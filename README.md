# Akka UTM Link Builder

Static tool for non-technical collaborators to generate correctly formatted UTM
tracking links for akka.app, without needing to know UTM syntax. Deployed on
Vercel, connected to a GitHub repo -- every `git push` to `main` triggers an
automatic redeploy, no CLI or manual step needed.

No sensitive data lives in this page (no spend/revenue numbers, unlike the
marketing dashboard site), so the repo and the deployed site can both be
public -- no password gate needed.

## Local files

- `index.html` -- the whole tool (form + live UTM preview + copy button +
  "Create short link" button).
- `api/shorten.js` -- Vercel serverless function. The browser never talks to
  Short.io directly; it calls this endpoint, which holds the Short.io secret
  key server-side and forwards the request.

## Connecting Short.io (one-time setup)

1. Create a Short.io account and add `go.akka.app` as a domain (Short.io gives
   you a CNAME record to add in akka.app's DNS -- someone with DNS access
   needs to add that).
2. In Short.io, go to Settings -> Integrations & API and copy the Secret Key.
3. In the Vercel project settings for this site, add an environment variable
   `SHORTIO_API_KEY` with that value (Production). Redeploy.
4. Optional: if the domain in Short.io isn't `go.akka.app`, also set
   `SHORTIO_DOMAIN` to whatever it is.

Until `SHORTIO_API_KEY` is set, the "Create short link" button will show an
error explaining Short.io isn't connected yet -- the rest of the tool (long
UTM link + copy) works regardless.

## Updating

Edit `index.html` (or `api/shorten.js`) directly, then:

```bash
git add -A
git commit -m "Update UTM link builder"
git push
```

Vercel's GitHub integration picks up the push and redeploys automatically.
