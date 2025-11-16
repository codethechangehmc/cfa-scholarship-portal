"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
// import session from "express-session";
// import MongoStore from "connect-mongo";
// import passport from "./utils/passportConfig";
const routes_1 = __importDefault(require("./routes"));
const BACKEND_PORT = Number(process.env.BACKEND_PORT ?? 8080);
const FRONTEND_ADDRESS = process.env.FRONTEND_ADDRESS ?? "*";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-secret";
const PRODUCTION = process.env.PRODUCTION_STR === "true";
const DB_URL = process.env.DB_URL ?? process.env.MONGO_URI ?? "mongodb://db:27017/cfa";
const app = (0, express_1.default)();
mongoose_1.default
    .connect(DB_URL)
    .then(() => console.log("Connected to database."))
    .catch((err) => console.error(`Error: ${err}`));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: FRONTEND_ADDRESS === "*" ? "*" : FRONTEND_ADDRESS,
    credentials: true,
}));
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
app.get("/health", (_req, res) => {
    res.json({ ok: true });
});
// Mount all API routes
app.use(routes_1.default);
app.listen(BACKEND_PORT, () => {
    console.log(`REST API listening on port ${BACKEND_PORT}`);
});
