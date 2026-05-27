const Job = require("../models/job");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

module.exports.getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.send({ data: items }))
    .catch(next);
};

module.exports.createItem = async (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;
  return Item.create({ name, imageUrl, weather, owner })
    .then((data) => res.status(201).send({ data }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .orFail(() => {
      next(new NotFoundError("User not found"));
    })
    .then((item) => {
      if (req.user._id !== item.owner.toString()) {
        return next(new ForbiddenError("Not authorized"));
      }
      return Item.findByIdAndDelete(itemId).then(() =>
        res.status(200).send({ message: "Item deleted successfully" }),
      );
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.toggleLike = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  try {
    const item = await Item.findById(itemId).orFail(() => {
      throw new NotFoundError("Item not found");
    });

    const isLiked = item.likes.includes(userId);
    const updateOperation = isLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    const updatedItem = await Item.findByIdAndUpdate(itemId, updateOperation, {
      new: true,
    });

    res.status(200).send({ data: updatedItem });
  } catch (error) {
    next(error);
  }
};
