import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { connectToDatabase } from "./db/db.js";
import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import logoutRoute from "./routes/logout.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

//enable session
app.use(
  session({
    secret: "mental-health-monitor",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  }
  res.redirect("/login");
}

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Use the routes
app.post("/register", registerRoute);
app.post("/login", loginRoute);
app.get("/logout", logoutRoute);

//test route
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Test success!" });
});

//get-username route
app.get("/get-username", isAuthenticated, (req, res) => {
  const username = req.session.username;
  if (username) {
    res.json({ username });
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

// Start your server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectToDatabase();
export default app;
