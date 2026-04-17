# Nuwatts Space Landing Page  

A static-export Next.js landing page designed for GitHub Pages hosting, with:
- App Router
- Tailwind CSS
- scroll-based motion via Framer Motion
- optional Google Analytics 4
- static-compatible email capture
- GitHub Actions workflow for Pages deployment

## Why this setup  

GitHub Pages is a static hosting platform, so this project is configured with Next.js static export using `output: 'export'`. Next.js recommends static export for static hosting, and GitHub Pages supports custom workflow deployments. citeturn249147search2turn842625search0turn842625search2

## Quick start

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Email capture

This site works without a backend. Set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in `.env.local` to a Formspree or FormSubmit endpoint.

If no endpoint is set, the email form falls back to opening the user's mail app addressed to `hello@nuwatts.com`.

## Analytics

Set `NEXT_PUBLIC_GA_ID` in `.env.local` if you want Google Analytics 4.

Example:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## GitHub Pages deployment

1. Create a GitHub repo.
2. Push these files to the repo.
3. In GitHub, go to **Settings → Pages**.
4. Under **Build and deployment**, choose **GitHub Actions**.
5. Push to `main` and the included workflow will build and deploy.

For project pages, the workflow automatically sets the correct base path (`/<repo-name>`). For user pages (`<username>.github.io`), it uses the root path.

## Build locally

```bash
npm run build
```

The static output will be created in `out/`.

## Notes

- Avoid server-only Next.js features if you want to keep GitHub Pages compatibility.
- Default Next.js image optimization is disabled because static export does not support it without a server. citeturn249147search2
