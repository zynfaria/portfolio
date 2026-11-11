# Portfolio

A full-stack portfolio built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**. Public content is stored in Neon Postgres and edited from a password-protected admin page.

## Set up

1. Create a [Neon](https://neon.tech) Postgres project.
2. Copy `.env.example` to `.env.local` and fill in:
   - `DATABASE_URL`: the connection string from Neon.
   - `ADMIN_PASSWORD`: a strong password for `/admin`.
   - `SESSION_SECRET`: a random secret of at least 32 characters. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - For local resume uploads, optionally set `BLOB_READ_WRITE_TOKEN` to a Vercel Blob read-write token. On Vercel, connect the Blob store to the project and use its OIDC connection (`BLOB_STORE_ID`); no long-lived read-write token is required.
3. Install dependencies and start the app:

   ```bash
   npm install
   npm run dev
   ```

Open http://localhost:3000. The database tables and starter content are created automatically on first use.

## Editing content

Visit `/admin` and sign in with `ADMIN_PASSWORD`. You can edit your profile and resume details, add work experience, and create, update, or delete projects. Changes appear on the public site immediately.

Project image URLs can be entered one per line in the project editor. Multiple images display as a slideshow on the portfolio.

In **Profile & resume**, choose **Upload PDF** or **Replace PDF** to upload a public resume PDF to Vercel Blob. The app creates a short-lived, single-file signed upload URL on the server and sends the PDF directly from the browser to Blob. On Vercel, connect a Blob store to the project and enable its OIDC connection; the app uses `BLOB_STORE_ID` and Vercel's OIDC credentials, so `BLOB_READ_WRITE_TOKEN` is not required in production. For local development, provide a `BLOB_READ_WRITE_TOKEN` in `.env.local` unless your local Vercel CLI workflow supplies OIDC credentials. PDFs must be 10 MB or smaller. The resume link updates after the upload completes.

The three starter projects are examples, not client case studies. Edit or delete them before publishing real work.

## Deploy to Vercel

Import the repository into Vercel and add `DATABASE_URL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` to the project’s Environment Variables. Connect the Vercel Blob store to the project and enable OIDC for that project connection so Vercel supplies `BLOB_STORE_ID` and its short-lived OIDC credentials. A production `BLOB_READ_WRITE_TOKEN` is not needed. Redeploy after connecting the store or changing environment settings.

## Scripts

- `npm run dev` — start the local development server
- `npm run build` — create a production build
- `npm run start` — run the production server
- `npm run lint` — run ESLint
