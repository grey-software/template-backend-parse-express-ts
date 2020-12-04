// Loads required libraries
require("dotenv").config()
var ParseDashboard = require("parse-dashboard");
const ParseServer = require("parse-server").ParseServer;
const Parse = require('parse/node');
var path = require("path");
import express from "express";

const PORT = 8000;
const BASE_URL = process.env.BASE_URL || "localhost";

var databaseUri = process.env.MONGODB_URI || "mongodb://localhost:27017/dev";
if (!databaseUri) {
  console.log("DATABASE_URI not specified, falling back to localhost.");
}

Parse.initialize("template-backend-parse-express-ts", process.env.APP_MASTER_KEY);
Parse.serverURL = `http://${BASE_URL}:${PORT}/api`

const parseApi = new ParseServer({
  databaseURI: databaseUri,
  appId: process.env.APP_ID || "template-backend-parse-express-ts",
  masterKey: process.env.APP_MASTER_KEY || "",
  serverURL: process.env.SERVER_URL || `http://${BASE_URL}:${PORT}/api`,
  verbose: true
});

const masterKey= process.env.APP_MASTER_KEY || ""
console.log(masterKey)

var parseDashboard = new ParseDashboard(
  {
    apps: [
      {
        serverURL: `http://${BASE_URL}:${PORT}/api`,
        appId: "template-backend-parse-express-ts",
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

function populateDbWithTestData() {
  const GameScore = Parse.Object.extend("GameScore");
  const gameScore = new GameScore();

  gameScore.set("score", 1337);
  gameScore.set("playerName", "Sean Plott");

  gameScore.save().then(
    (gameScore: any) => {
      // Execute any logic that should take place after the object is saved.
      console.log("New object created with objectId: " + gameScore.id);
    },
    (error: any) => {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      console.log("Failed to create new object, with error code: " + error);
    }
  );
}

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://${BASE_URL}:${PORT}`);
  populateDbWithTestData()
  
});
