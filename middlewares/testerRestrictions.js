const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports.deleteJobRestrictions = (req, res, next) => {
  try {
    const { jobId } = req.params;
    if (
      req?.user?._id === "6a3562381d37c2c09dd4d234" &&
      jobId === "6a5ec260c1ed2fd7a13521b9"
    ) {
      next(new UnauthorizedError("unauthorized action for testing"));
    }

    next();
  } catch (err) {
    next(err);
  }
};
