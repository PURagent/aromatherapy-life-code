# Cloudflare Pages deployment

Status: prepared; account sign-in and project creation are pending. The requested name has not been reserved.

- Plan: Free
- Project name: `mornaenae-lifecode`
- Requested URL: `https://mornaenae-lifecode.pages.dev`
- GitHub repository: `PURagent/aromatherapy-life-code`
- Production branch: `main`
- Root directory: repository root
- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: 22 (see `.node-version`)

Use Cloudflare Pages Git integration so pushes to GitHub rebuild the site automatically. Do not set `GITHUB_ACTIONS=true` in Cloudflare: Vite must build with `/` as the base URL. The existing GitHub Pages deployment continues to use `/aromatherapy-life-code/`.

Cloudflare's default SPA fallback supports application routes because the build has no top-level `404.html`. The GitHub workflow creates its own 404 fallback after building; that step is not used by Cloudflare.

After deployment, verify the homepage, poster assets, `/scents`, and all six feature links before updating the LINE OA links:

- `/#scent-story`
- `/#begin`
- `/#collection`
- `/#numbers`
- `/#cart`
- `/#privacy`

Keep the existing GitHub Pages site available. Enable no paid add-ons for this deployment.
