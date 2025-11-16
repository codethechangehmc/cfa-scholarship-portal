import "dotenv/config"

import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
// import session from "express-session";
// import MongoStore from "connect-mongo";
// import passport from "./utils/passportConfig";
import routes from "./routes";

// Import all models to ensure they're registered with Mongoose
import "./models/User";
import "./models/Application";
import "./models/RenewalChecklist";
import "./models/AcceptanceForm";
import "./models/ReimbursementRequest";
import "./models/File";

const BACKEND_PORT = Number(process.env.BACKEND_PORT ?? 8080);
const FRONTEND_ADDRESS = process.env.FRONTEND_ADDRESS ?? "*";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-secret";
const PRODUCTION = process.env.PRODUCTION_STR === "true";
const DB_URL = process.env.DB_URL ?? process.env.MONGO_URI ?? "mongodb://db:27017/cfa";

const app = express();

mongoose
  .connect(DB_URL)
  .then(() => console.log("Connected to database."))
  .catch((err: unknown) => console.error(`Error: ${err}`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_ADDRESS === "*" ? "*" : FRONTEND_ADDRESS,
    credentials: true,
  })
);

// Auth / session middleware commented out until ready
/*
app.use(
  session({
    resave: false,
    secret: SESSION_SECRET,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: PRODUCTION,
      sameSite: PRODUCTION ? "none" : "Lax",
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(routes);
*/

// Minimal health route for quick testing
app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// Mount all API routes
app.use(routes);

app.listen(BACKEND_PORT, () => {
  console.log(`REST API listening on port ${BACKEND_PORT}`);
});
