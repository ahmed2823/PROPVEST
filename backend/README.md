# PropVest API

The API provides account registration and sign-in backed by MongoDB.

## Requirements

- Node.js 20 or newer
- MongoDB Community Server running locally, or a MongoDB connection URI

## Run locally

1. Copy `backend/.env.example` to `backend/.env`.
2. Set `JWT_SECRET` to a new random value at least 32 bytes long. Keep this secret out of source control.
3. Set `MONGODB_URI` if MongoDB is not using the local default.
4. Start MongoDB, then run `npm install --prefix backend` once and `npm run server` from the repository root.
5. Copy the repository-root `.env.example` to `.env`. Change `EXPO_PUBLIC_API_URL` to a host address reachable by your device when testing on a phone.
6. Check `http://localhost:3000/api/health`; a healthy response is `{"status":"ok"}`.

On startup, Mongoose connects to the `propvest` database and creates the `users` collection and its unique email index. Passwords are stored as bcrypt hashes, not plaintext.

## Connect the app

The app defaults to `http://localhost:3000/api`, which works in a browser on the same computer. For a physical phone, set `EXPO_PUBLIC_API_URL` in the repository-root `.env` to the computer's LAN address, for example `http://192.168.1.20:3000/api`, and restart Expo. Android emulators also need a host address reachable from the emulator rather than the phone's `localhost`. Allow the selected port through the computer's firewall on a trusted network only.

For web development on a different origin, add that origin to `CORS_ORIGIN` in `backend/.env`.

## Authentication endpoints

- `POST /api/auth/signup` — `{ "name": "Asha Rao", "email": "asha@example.in", "password": "..." }`
- `POST /api/auth/signin` — `{ "email": "asha@example.in", "password": "..." }`
- `GET /api/auth/me` — requires `Authorization: Bearer <token>`

Successful sign-in and sign-up responses include a seven-day bearer token and the user's public profile. Authentication requests are rate limited.

Run backend validation tests with `npm run server:test`.
