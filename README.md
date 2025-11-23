# CFA Scholarship Portal

## Setup

1. Make sure `backend/.env` is correct

## Running with Docker

```bash
yarn docker
```

## Running with Yarn

Backend:
```bash
cd backend
yarn install
yarn dev
```

Frontend:
```bash
cd frontend
yarn install
yarn dev
```

Open http://localhost:3000/new-applicant
Open http://localhost:3000/renewal

## Notes

- Disconnect VPN when connecting to MongoDB Atlas
- Backend runs on port 8080
- Frontend runs on port 3000
