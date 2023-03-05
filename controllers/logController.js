const express = require("express");
const router = express.Router();
const Log = require("models/Log");

router.post("/", function (req, res) {
  Log.create(
    {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    },
    function (error, log) {
      if (error) {
        const message = `Server error: ${error.message}`;
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: message });
      }
    }
  );
});

module.exports = router;