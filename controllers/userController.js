const express = require("express");
const router = express.Router();
const httpStatus = require("lib/httpStatus");
const verifyToken = require("lib/verifyToken");
const User = require("models/User");

const { userSelection } = require("selections/selections");
const avatarList = require("avatarList");

router.get("/", verifyToken, function (req, res) {
  User.findById(req.userId, userSelection, function (error, user) {
    if (error) {
      const message = `Server error: ${error.message}`;
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: message });
    } else {
      res.status(httpStatus.OK).json(user);
    }
  });
});

router.get("/avatar-list", verifyToken, function (req, res) {
  res.status(httpStatus.OK).send(avatarList);
});

router.put("/", verifyToken, function (req, res) {
  const { firstName, lastName, avatarUrl } = req.body;

  if (!firstName || !lastName || !avatarUrl) {
    let message = "Field(s) not supplied: ";
    if (!firstName) message += "firstName ";
    if (!lastName) message += "lastName ";
    if (!avatarUrl) message += "avatarUrl";
    return res.status(httpStatus.BAD_REQUEST).send({ error: message });
  }

  User.findByIdAndUpdate(
    req.userId,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatarUrl: req.body.avatarUrl,
      },
    },
    { new: true, select: userSelection },
    function (error, user) {
      if (error) {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send(`Server error: ${error.message}`);
      } else {
        return res.status(httpStatus.OK).send(user);
      }
    }
  );
});

module.exports = router;
