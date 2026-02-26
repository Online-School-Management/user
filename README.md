This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## SEO & social sharing

The app sets Open Graph and Twitter Card metadata so link previews (image + title + description) work on Telegram, Facebook, Viber, LinkedIn, etc.

- **Base URL:** Set `NEXT_PUBLIC_APP_URL` in your environment to your **production** URL (e.g. `https://www.tiptopeducation.net`). Preview image and URLs must be absolute; if this is wrong or unset, previews can be empty or broken.
- **Default preview image:** A dynamic image is served at `/og` (see `src/app/og/route.tsx`). No static file is required.
- **Refreshing cached previews:** After deploy, use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or share the link again; some platforms cache the first fetch.

**Vercel: previews still not showing?**

- `NEXT_PUBLIC_*` is baked in at **build time**. If you added or changed `NEXT_PUBLIC_APP_URL` in Vercel after your last deploy, the running app still has the old value. You must **trigger a new deployment** (e.g. Deployments → Redeploy, or push a new commit) after saving the env var so the new build picks it up.
- In Vercel: Project → Settings → Environment Variables → ensure `NEXT_PUBLIC_APP_URL` is set for **Production** and matches your live site (e.g. `https://www.tiptopeducation.net`).
- Then redeploy, wait for the build to finish, and test again with Facebook Debugger or by sharing the link in Telegram.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
