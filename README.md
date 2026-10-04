# Task 3 (Variant): Campus Marketplace — with Authentication

Task 1's Campus Marketplace API with JWT login/register on the server and a
React client with a login flow.

## Running it

```
npm run install:all   # installs server/ and client/ (npm workspaces)
npm run dev           # API on :4000, client on :5175
```

Create `server/.env` yourself with:

```
PORT=4000
MONGO_URI=<ADD_YOUR_CONNECTION_STRING_HERE>
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
```

`JWT_SECRET` is the key the server signs and verifies login tokens with —
anyone who knows it can forge a token for any user, so replace `change-me`
with a long random value. Generate one with:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste the output after `JWT_SECRET=` and restart the server. Changing the
secret logs everyone out, because tokens signed with the old one stop being
valid.

## What was added on top of Task 1

### Server
- `POST /api/auth/register`, `POST /api/auth/login` → `{ token, user }`;
  `GET /api/auth/me` (requires token).
- `middleware/auth.js` — `requireAuth` reads `Authorization: Bearer <token>`,
  verifies it with `JWT_SECRET` and sets `req.user = { id, name }`.
- `User.comparePassword()`; the `password` field stores the bcrypt hash.
- Listings: reading (`GET /`, `GET /:id`) stays public, and removed listings
  stay hidden unless `?includeRemoved=true`. Creating, editing and removing
  require a token. `seller` is set from `req.user.id` (sending it in the body
  is rejected), and only the seller can edit or remove a listing (`403`
  otherwise). Removing is still a soft delete (`status: 'removed'`).
  Listings are populated with the seller's `name`/`email`.
- Users: `POST /api/users` was removed (use `/api/auth/register`);
  `PATCH`/`DELETE /api/users/:id` require a token and only work on your own
  account.

### Client (`client/`, Vite + React + Tailwind)
- `AuthContext` stores the token in `localStorage`, restores the session via
  `/auth/me`, and `api.js` attaches the token to every request.
- Pages: Login, Register, Listings (list, edit/remove on your own listings).
  ListingForm is left for you — see below.

## Your task — the Sell an Item page

Everything above is already working. Your job is the frontend of creating a
listing: `client/src/pages/ListingForm.jsx`. It is already routed at
`/listings/new` and `/listings/:id`, both behind `ProtectedRoute`, and the
"Sell an Item" nav link and the "Edit" buttons already point to it.

### TODO 1 — the form
Render inputs bound to the `form` state:
- `title` — text input (e.g. `Calculus textbook`)
- `price` — number input, `0` or more (store it as a **number**, not a
  string)
- `category` — select: `textbooks`, `electronics`, `furniture`, `clothing`,
  `other`
- `condition` — select: `new`, `like-new`, `used`, `worn`
- `description` — textarea (optional)
- `status` — select: `active`, `sold` — **only shown when editing**

The select values must match these strings exactly — anything else is
rejected by the server. Implement `onChange` so every input updates `form`.

### TODO 2 — creating a listing
In `onSubmit`, send `POST /api/listings` with the form fields using the `api`
instance from `client/src/api.js` (it already attaches your token). On
success, navigate back to `/listings`. On failure, show the server's
`message` in the `error` box — try it: a negative price returns `400`.

Do **not** send `seller` — the server takes the seller from your token and
rejects the request if you send it.

### TODO 3 — editing a listing
When the URL has an `id`, load the listing with `GET /api/listings/:id` and
fill the form with its `title`, `price`, `category`, `condition`, `status`
and `description`. On submit, send `PATCH /api/listings/:id` instead of
`POST` — this is how a seller marks an item as `sold`. Editing someone
else's listing returns `403` — show that message too.

You're expected to use AI tools while building this. But you should be able
to explain, for any line in your component, *why* it's there and what
happens if you delete it. We will ask.
