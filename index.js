// Loads required libraries
var express = require("express");
var ParseServer = require("parse-server").ParseServer;
var ParseDashboard = require("parse-dashboard");
var path = require("path");

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
if (!databaseUri) {
  console.log("DATABASE_URI not specified, falling back to localhost.");
}

const parseApi = new ParseServer({
  databaseURI: databaseUri || "mongodb://localhost:27017/dev",
  appId: process.env.APP_ID || "grey-parse-backend-template",
  masterKey: process.env.MASTER_KEY || "", //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || "http://localhost:1337/parse", // Don't forget to change to https if needed
});

var parseDashboard = new ParseDashboard(
  {
    // Parse Dashboard settings
  },
  {
    apps: [
      {
        serverURL: "http://localhost:1337/parse",
        appId: "grey-parse-backend-template",
        masterKey: "",
        appName: "Grey Software Parse Backend Template",
      },
    ],
  }
);

var app = express();

// Serve static assets from the /public folder
app.use("/public", express.static(path.join(__dirname, "/public")));

// Parse Server plays nicely with the rest of your web routes
app.get("/", function(req, res) {
  res
    .status(200)
    .send(
      "I dream of being a website.  Please star the parse-server repo on GitHub!"
    );
});

// Serve the Parse API on the /parse URL prefix
var apiEndpoint = process.env.PARSE_MOUNT || "/parse";
app.use(apiEndpoint, parseApi);

// make the Parse Dashboard available at /dashboard
app.use("/dashboard", parseDashboard);

app.listen(4040, () => {
  console.log("App running on port 8080");
});
