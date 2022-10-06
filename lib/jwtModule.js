const jwt = require("jsonwebtoken");

sign = (payload, options) => {
  const signingOptions = {
    algorithm: "HS256",
    // expiresIn: process.env.JWT_EXPIRES,
    issuer: process.env.JWT_ISSUER,
    subject: options.subject,
  };
  return jwt.sign(payload, process.env.JWT_KEY, signingOptions);
};

parseTokenFromAuthorizationHeader = (req) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader || !authorizationHeader.includes("Bearer ")) {
    return null;
  }
  return req.headers["authorization"].split(" ")[1];
};

verify = (token) => {
  const verifyOptions = {
    algorithm: ["RS256"],
    // expiresIn: process.env.JWT_EXPIRES,
    issuer: process.env.JWT_ISSUER,
  };
  try {
    return jwt.verify(token, process.env.JWT_KEY, verifyOptions);
  } catch (err) {
    return null;
  }
};

decode = (token) => {
  return jwt.decode(token, { complete: true });
};

module.exports = {
  sign,
  parseTokenFromAuthorizationHeader,
  verify,
  decode,
};
