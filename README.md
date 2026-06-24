# DexLabz Access

A one-time-code registration application built with Next.js, TypeScript,
Tailwind CSS, and MongoDB.

## Requirements

- Node.js 20.9 or newer
- npm
- MongoDB Atlas or another replica-set deployment that supports transactions

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Replace every placeholder with your own database URL and random secrets.
3. Install dependencies with `npm install`.
4. Start the development server with `npm run dev`.
5. Open `http://localhost:3000`.

On Windows PowerShell systems that block npm scripts, use `npm.cmd` in place of
`npm`, for example `npm.cmd run dev`.

## Commands

- `npm run dev` - start the development server
- `npm run lint` - run ESLint
- `npm run typecheck` - check TypeScript
- `npm run build` - create a production build
- `npm run db:indexes` - ensure required MongoDB indexes exist
- `npm run codes:import -- <file>` - securely import authentication codes

Do not commit `.env.local` or authentication codes.

`MONGO_URI` is accepted as an alias for `MONGODB_URI`. `SESSION_SECRET` must be
a random value of at least 32 characters.

## Importing authentication codes

Codes are normalized and stored in plaintext in MongoDB. Restrict database
access because anyone who can read the authentication-code collection can see
all available codes.

Use a JSON array:

```json
[
  "ACCESS-001",
  {
    "code": "ACCESS-002",
    "assignedEmail": "member@example.com",
    "batch": "launch",
    "expiresAt": "2026-12-31T23:59:59Z"
  }
]
```

Or use a text file with one code per line. Blank lines and lines beginning
with `#` are ignored.

Preview an import:

```powershell
npm.cmd run codes:import -- .\private\codes.txt --dry-run
```

Import it:

```powershell
npm.cmd run codes:import -- .\private\codes.txt
```

Existing codes are left unchanged. Duplicate values in the input file are
collapsed, and the unique database index prevents duplicate codes under
concurrent imports.
