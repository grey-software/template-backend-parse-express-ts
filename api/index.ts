// Loads required libraries
var ParseDashboard = require("parse-dashboard");
const ParseServer = require("parse-server").ParseServer;
var path = require("path");
import express from "express";

const PORT = 8000;
const BASE_URL = process.env.BASE_URL || "localhost";

var databaseUri = process.env.MONGODB_URI || "mongodb://localhost:27017/dev";
if (!databaseUri) {
  console.log("DATABASE_URI not specified, falling back to localhost.");
}

const parseApi = new ParseServer({
  databaseURI: databaseUri,
  appId: process.env.APP_ID || "parse-express-backend-template",
  masterKey: process.env.APP_MASTER_KEY || "",
  serverURL: process.env.SERVER_URL || `http://${BASE_URL}:${PORT}/api`,
});

var parseDashboard = new ParseDashboard(
  {
    apps: [
      {
        serverURL: `http://${BASE_URL}:${PORT}/api`,
        appId: "parse-express-backend-template",
        masterKey: process.env.APP_MASTER_KEY || "",
        appName: "Grey Software Parse Backend Template",
      },
    ],
  },
  true
);

var app = express();

// Serve static assets from the /public folder
app.use("/public", express.static(path.join(__dirname, "/public")));

// Serve the Parse API at /api
app.use("/api", parseApi);

// Serve the Parse Dashboard at /dashboard
app.use("/dashboard", parseDashboard);

app.get("/", (_, res) =>
  res.send("Your backend is live! Visit /dashboard for more details!")
);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://${BASE_URL}:${PORT}`);
});
