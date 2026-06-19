const BadRequestError = require("../errors/BadRequestError");
const Part = require("../models/part");

module.exports.createPart = async (req, res, next) => {
  try {
    const { name, cost, partNumber } = req.body;
    const newPart = await Part.create({
      name,
      cost,
      partNumber,
      owner: req.user._id,
    });
    const partObject = newPart.toJSON();

    return res.status(201).send(partObject);
  } catch (err) {
    if (err.name === "ValidationError") {
      console.log(err.errors);
      return next(new BadRequestError("invalid data"));
    }

    return next(err);
  }
};

module.exports.getParts = (req, res, next) => {
  const owner = req.user._id;

  Part.find({ owner })
    .then((parts) => res.send({ data: parts }))
    .catch(next);
};

module.exports.deletePart = (req, res, next) => {
  const { partId } = req.params;
  Part.findById(partId)
    .orFail(() => {
      next(new NotFoundError("Part not found"));
    })
    .then((part) => {
      if (req.user._id !== part.owner.toString()) {
        return next(new ForbiddenError("Not authorized"));
      }
      return Part.findByIdAndDelete(partId).then(() =>
        res
          .status(200)
          .send({ message: "Part deleted successfully", id: partId }),
      );
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updatePart = (req, res, next) => {
  const { partId } = req.params;
  const userId = req.user._id;

  const { name, partNumber, cost } = req.body;

  Part.findOneAndUpdate(
    { _id: partId, owner: userId },
    {
      name,
      partNumber,
      cost,
    },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError("Part not found");
    })
    .then((job) => res.status(200).send(job))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("invalid data"));
      }

      next(err);
    });
};
