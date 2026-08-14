const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports.disallowTester = (req, res, next) => {
  try {
    if (req?.user?._id === "6a3562381d37c2c09dd4d234") {
      next(new UnauthorizedError("unauthorized action for testing"));
    }

    next();
  } catch (err) {
    next(err);
  }
};
