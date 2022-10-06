const jwtModule = require("./jwtModule");
const httpStatus = require("./httpStatus");

function verifyToken(req, res, next) {
  req.userId = undefined;
  const token = jwtModule.parseTokenFromAuthorizationHeader(req);
  if (token) {
    const verifyResult = jwtModule.verify(token);
    if (verifyResult && verifyResult.id) {
      req.userId = verifyResult.id;
      next();
    } else {
      return res
        .status(httpStatus.FORBIDDEN)
        .send("Bearer token failed verification");
    }
  } else {
    return res
      .status(httpStatus.FORBIDDEN)
      .send("Bearer token not provided as expected in authorization header");
  }
}

module.exports = verifyToken;
