# Portfolio

A full-stack portfolio built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**. Public content is stored in Neon Postgres and edited from a password-protected admin page.

## Set up

1. Create a [Neon](https://neon.tech) Postgres project.
2. Copy `.env.example` to `.env.local` and fill in:
   - `DATABASE_URL`: the connection string from Neon.
   - `ADMIN_PASSWORD`: a strong password for `/admin`.
   - `SESSION_SECRET`: a random secret of at least 32 characters. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - `BLOB_READ_WRITE_TOKEN`: a read-write token for a Vercel Blob store, used for resume PDF uploads.
3. Install dependencies and start the app:

   ```bash
   npm install
   npm run dev
   ```

Open http://localhost:3000. The database tables and starter content are created automatically on first use.

## Editing content

Visit `/admin` and sign in with `ADMIN_PASSWORD`. You can edit your profile and resume details, add work experience, and create, update, or delete projects. Changes appear on the public site immediately.

In **Profile & resume**, choose **Upload PDF** or **Replace PDF** to upload a public resume PDF to Vercel Blob. Create a Blob store connected to the project and configure `BLOB_READ_WRITE_TOKEN`. PDFs must be 10 MB or smaller. The resume link updates after the upload completes.

The three starter projects are examples, not client case studies. Edit or delete them before publishing real work.

## Deploy to Vercel

Import the repository into Vercel and add `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, and `BLOB_READ_WRITE_TOKEN` to the project’s Environment Variables. Use a Neon connection string for `DATABASE_URL` and connect a Vercel Blob store to the project. Redeploy after setting the variables.

## Scripts

- `npm run dev` — start the local development server
- `npm run build` — create a production build
- `npm run start` — run the production server
- `npm run lint` — run ESLint
