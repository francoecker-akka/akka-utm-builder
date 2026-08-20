# Akka UTM Link Builder

Static tool for non-technical collaborators to generate correctly formatted UTM
tracking links for akka.app, without needing to know UTM syntax. Deployed on
Vercel, connected to a GitHub repo -- every `git push` to `main` triggers an
automatic redeploy, no CLI or manual step needed.

No sensitive data lives in this page (no spend/revenue numbers, unlike the
marketing dashboard site), so the repo and the deployed site can both be
public -- no password gate needed.

## Local files

- `index.html` -- the whole tool (form + live UTM preview + copy button), no
  build step, no dependencies.

## Updating

Edit `index.html` directly, then:

```bash
git add index.html
git commit -m "Update UTM link builder"
git push
```

Vercel's GitHub integration picks up the push and redeploys automatically.
