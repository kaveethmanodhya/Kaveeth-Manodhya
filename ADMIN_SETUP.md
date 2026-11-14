# Portfolio Admin Dashboard

This feature adds a private editor at **/admin**. It maintains the existing portfolio design while making content data-driven.

## Setup after merging the pull request

1. In Vercel, open **Project → Settings → Environment Variables**.
2. Add the variables from `.env.example`:
   - `ADMIN_PASSWORD`: use a unique password of 12+ characters.
   - `ADMIN_SESSION_SECRET`: use a cryptographically random 32+ character string, separate from the password.
   - `GITHUB_CONTENT_TOKEN`: fine-grained GitHub personal access token limited to this portfolio repository, with **Contents: Read and write** permission.
   - `GITHUB_CONTENT_REPO=kaveethmanodhya/Kaveeth-Manodhya`
   - `GITHUB_CONTENT_BRANCH=redesign/scroll-film-portfolio` (change if Vercel production deploys a different branch).
3. Redeploy the website so the new environment variables load.
4. Open `https://YOUR-DOMAIN/admin`, enter the password, edit a section, then select **Save Changes**.
5. The dashboard updates `data/portfolio.json` through GitHub's API; projects and images can be added or removed, lists reordered, and headings, descriptions, education, experience, services, links, skills, statistics, and SEO changed.
6. Image upload commits a new image under `public/uploads/`. On Vercel, GitHub pushes to the production branch should trigger a deployment for new image assets. Existing image URLs continue to work.
7. Portfolio text is fetched from the GitHub content file on the server through `/api/portfolio` (no-store), so updates can appear without recompiling the React components. GitHub token is never sent to browsers.

## Notes

- Never commit `.env.local` or token values.
- The admin session is signed and HTTP-only. Login expires after 12 hours.
- For security the admin UI supports editing content, **not arbitrary code execution**.
- The portfolio uses bundled `data/portfolio.json` as a fallback if the GitHub token is not set or GitHub is temporarily unavailable; without a token, admin writes are disabled.
- The existing footer double-click view count is not authentication.
- Changes are recorded as commits in the selected GitHub branch. You can restore previous content through GitHub's commit history.
- There is no graphical editor for arbitrary CSS/layout/animation logic. That still requires a code change.
- A safe improvement for production is to add rate-limiting/WAF rules for `/api/admin/login` through your hosting provider.

## Cloudinary media storage

In Vercel, add these **server-side** environment variables for the Preview deployment:

```dotenv
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

Find these values in your Cloudinary Console > API Keys. Never share the API Secret or GitHub token in chat, never put them in `NEXT_PUBLIC_*` variables, and never commit an actual `.env.local` file. Redeploy after changing Vercel environment variables.

Go to `/admin` > **Media Manager** for independent portrait, project cover, education logo and company logo uploads. Uploads are performed server-side with the authenticated admin session and stored under `portfolio/profile`, `portfolio/projects`, `portfolio/education` or `portfolio/logos` in Cloudinary. The dashboard automatically fills the secure image URL and shows a preview. **Save Changes** is a separate action that writes the new URL into the portfolio JSON in GitHub. Uploading alone does not publish the change.

For preview builds set `GITHUB_CONTENT_BRANCH=feature/film-portfolio-admin`; after merging into the deployed film branch use `GITHUB_CONTENT_BRANCH=redesign/scroll-film-portfolio`. Test the new features before merging. Unused images remain in Cloudinary until separately deleted.

Cloudinary uploads accept JPEG, PNG, WebP, GIF and AVIF files below 8 MB. The Next.js image config allows HTTPS URLs on `res.cloudinary.com`. Do not enable unsigned uploading for this dashboard.

> Note: The film portfolio uses Next.js dynamic content loaded from GitHub. Image uploads are Cloudinary-backed, but text and link edits continue to be saved in `data/portfolio.json` through the GitHub Contents API.
