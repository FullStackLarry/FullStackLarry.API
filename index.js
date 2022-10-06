//
// .env file
//
// TEST_PORT=<Local test port>
// MONGODB_CONNECTION=<MongoDB Connection String>
// JWT_KEY=<32 character random string>
// JWT_ISSUER=<Domain name>
// JWT_EXPIRES=<Expire time in seconds>
// MAIL_USER=<Mail User Name>
// MAIL_PASSWORD=<Mail Password>
// MAIL_SERVER=<Mail SMTP Server>
// MAIL_PORT=<Mail SMTP Port>
// NODE_ENV=development
//

require("rootpath")();
require("dotenv").config();
require("config/database").connect();

const globals = require("config/globals");
const httpStatus = require("lib/httpStatus");

const fs = require("fs");
var files = fs.readdirSync("./public/images/");
for (let i = 0; i < files.length; i++) {
  files[i] = "images/" + files[i];
}
files.sort();
require("./avatarList").avatarList = files;

const isDeveleopment = process.env.NODE_ENV === "development";

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (!isDeveleopment) {
  const enforce = require("express-sslify");
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(express.static("public"));

app.get(globals.API_VER, function (req, res) {
  res.status(httpStatus.OK).send("FSLAPI v1 running");
});

const authController = require("controllers/authController");
app.use(`${globals.API_VER}/auth`, authController);

const userController = require("controllers/userController");
app.use(`${globals.API_VER}/users`, userController);

const TMController = require("controllers/TMController");
app.use(`${globals.API_VER}/TM`, TMController);

app.get("/favicon.ico", (req, res) => res.status(204));

const port = process.env.PORT || process.env.TEST_PORT;
app.listen(port, function () {
  console.log(`FSLAPI app listening on port ${port}`);
});
