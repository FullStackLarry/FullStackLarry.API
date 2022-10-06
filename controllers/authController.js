const express = require("express");
const router = express.Router();
const argon = require("argon2");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");
const httpStatus = require("lib/httpStatus");
const jwtModule = require("lib/jwtModule");
const User = require("models/User");
const { userSelection } = require("selections/selections");

router.post("/login", function (req, res) {
  let { email, password } = req.body;
  if (!email || !password) {
    let message = "Field(s) not supplied: ";
    if (!email) message += "email ";
    if (!password) message += "password";
    return res.status(httpStatus.BAD_REQUEST).send({ error: message });
  }
  email = decodeURI(email);
  User.findOne({ email: email }, function (error, user) {
    if (error) {
      const message = `Server error: ${error.message}`;
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: message });
    } else {
      if (user) {
        if (user.verified) {
          const { _id, email, passwordHash } = user;
          argon
            .verify(passwordHash, req.body.password)
            .then((passwordMatch) => {
              if (passwordMatch) {
                const payload = { id: _id };
                const signingOptions = {
                  subject: email,
                };
                const signedToken = jwtModule.sign(payload, signingOptions);
                return res.status(httpStatus.OK).send({ token: signedToken });
              } else {
                const message = "Invalid email/Password";
                return res
                  .status(httpStatus.UNAUTHORIZED)
                  .send({ error: message });
              }
            });
        } else {
          const message = "Email not verified";
          return res.status(httpStatus.UNAUTHORIZED).send({ error: message });
        }
      } else {
        const message = "Invalid email/Password";
        return res.status(httpStatus.UNAUTHORIZED).send({ error: message });
      }
    }
  });
});

router.post("/register", function (req, res) {
  let { email, firstName, lastName, password } = req.body;
  if (!email || !firstName || !lastName || !password) {
    let message = "Field(s) not supplied: ";
    if (!email) message += "email ";
    if (!firstName) message += "firstName ";
    if (!lastName) message += "lastName ";
    if (!password) message += "password";
    return res.status(httpStatus.BAD_REQUEST).send({ error: message });
  }
  email = decodeURI(email);
  argon.hash(password).then((hashedPassword) => {
    const verificationCode = crypto.randomBytes(8).toString("hex");
    User.create(
      {
        email: email,
        firstName: firstName,
        lastName: lastName,
        verificationCode: verificationCode,
        verified: false,
        passwordHash: hashedPassword,
      },
      function (error, user) {
        if (error) {
          const message = `Server error: ${error.message}`;
          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ error: message });
        }
        const sent = sendEmail(email, verificationCode);
        if (sent) {
          return res.status(httpStatus.CREATED).send();
        } else {
          const message = "Unable to send verification email";
          return res.status(httpStatus.OK).send({ error: message });
        }
      }
    );
  });
});

router.post("/sendemail", function (req, res) {
  let email = req.body.email;
  if (!email) {
    const message = "Field not supplied: email";
    return res.status(httpStatus.BAD_REQUEST).send({ error: message });
  }
  email = decodeURI(email);
  User.findOne({ email: email }, (error, user) => {
    if (error) {
      const message = `Error finding user: ${error}`;
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: message });
    } else {
      if (user) {
        if (user.verified) {
          const message = "Email already verified";
          return res.status(httpStatus.BAD_REQUEST).send({ error: message });
        } else {
          const sent = sendEmail(user.email, user.verificationCode);
          if (sent) {
            return res.status(httpStatus.NO_CONTENT).send();
          } else {
            const message = "Unable to send email";
            return res
              .status(httpStatus.INTERNAL_SERVER_ERROR)
              .send({ error: message });
          }
        }
      } else {
        const message = "User not found";
        return res.status(httpStatus.BAD_REQUEST).send({ error: message });
      }
    }
  });
});

router.post("/validateemail", function (req, res) {
  let { email, code } = req.body;
  if (!email || !code) {
    const message = "Invalid parameters in request";
    return res.status(httpStatus.BAD_REQUEST).send({ error: message });
  }
  email = decodeURI(email);
  code = decodeURI(code);
  User.findOne(
    { email: email, verificationCode: code },
    function (error, user) {
      if (error) {
        const message = `Server error: ${error.message}`;
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ rror: message });
      } else {
        if (user) {
          if (user.verified) {
            const message = "Email already validated";
            return res.status(httpStatus.BAD_REQUEST).send({ error: message });
          } else {
            user.verified = true;
            user
              .save()
              .then((savedUser) => {
                return res.status(httpStatus.NO_CONTENT).send();
              })
              .catch((error) => {
                const message = `Error updating status. Please try again: ${error}`;
                return res
                  .status(httpStatus.INTERNAL_SERVER_ERROR)
                  .send({ error: message });
              });
          }
        } else {
          const message =
            "Validation failed: invalid email and/or validation code.";
          return res.status(httpStatus.BAD_REQUEST).send({ error: message });
        }
      }
    }
  );
});

async function sendEmail(email, code) {
  const transporter = new nodeMailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: parseInt(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const text = `Validation Code: ${code}`;
  const html = `<p>${text}</p>`;
  await transporter.sendMail(
    {
      from: '"noreply@fullstacklarry.com" noreply@fullstacklarry.com',
      to: email,
      subject: "FullStackLarry.com Email Validation Code",
      text: text,
      html: html,
    },
    (error, info) => {
      if (error) {
        console.log(`Email Error: ${error}`);
        return false;
      }
      // console.log(`Email Info: ${info}`);
      return true;
    }
  );
}

module.exports = router;
