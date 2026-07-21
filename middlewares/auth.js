const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/UnauthorizedError");

const unauthorizedTesting = [
  { method: "POST", baseUrl: "/invoice" },
  { method: "PATCH", baseUrl: "/users" },
];

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError("authorization required"));
  }

  req.user = payload;

  // handle unauthorized actions while testing
  if (req?.user?._id === "6a3562381d37c2c09dd4d234") {
    const isUnauthorizedTest = unauthorizedTesting.some(
      (route) => route.method === req.method && route.baseUrl === req.baseUrl,
    );
    if (isUnauthorizedTest) {
      next(new UnauthorizedError("unauthorized action for testing"));
    }
  }
  // console.log(req.user._id);
  // console.log(req.baseUrl);
  // console.log(req.method);

  return next();
};
