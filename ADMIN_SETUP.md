# Portfolio Admin Dashboard

This feature adds a private editor at **/admin**. It maintains the existing portfolio design while making content data-driven.

## Setup after merging the pull request

1. In Vercel, open **Project → Settings → Environment Variables**.
2. Add the variables from `.env.example`:
   - `ADMIN_PASSWORD`: use a unique password of 12+ characters.
   - `ADMIN_SESSION_SECRET`: use a cryptographically random 32+ character string, separate from the password.
   - `GITHUB_CONTENT_TOKEN`: fine-grained GitHub personal access token limited to this portfolio repository, with **Contents: Read and write** permission.
   - `GITHUB_CONTENT_REPO=kaveethmanodhya/Kaveeth-Manodhya`
   - `GITHUB_CONTENT_BRANCH=main` (change if Vercel production deploys a different branch).
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
