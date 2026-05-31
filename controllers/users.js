const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/BadRequestError");

const { notFound } = require("../utils/constants");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");

module.exports.logIn = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError("Incorrect Email or Password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError("Incorrect Email or Password"));
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET);
        return res.status(200).json({
          message: "Login successful",
          token,
        });
      });
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(new NotFoundError("User not found"));
    })
    .then((userData) => res.send(userData))
    .catch(next);
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, rate, phone, footer } = req.body;
    const newUser = await User.create({
      name,
      email,
      rate,
      phone,
      password: await bcrypt.hash(password, 10),
      footer,
    });
    const userObject = newUser.toJSON();
    delete userObject.password;

    return res.status(201).send(userObject);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return next(new BadRequestError("invalid data"));
    }
    if (err.code === 11000) {
      return next(new ConflictError("email already exists"));
    }
    return next(err);
  }
};

module.exports.updateCurrentUserRate = (req, res, next) => {
  const userId = req.user._id;
  const { rate } = req.body;
  User.findByIdAndUpdate(userId, { rate }, { new: true, runValidators: true })
    .orFail(() => {
      next(new NotFoundError("User not found"));
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("invalid data"));
      } else if (err.code === notFound) {
        next(new NotFoundError("user not found"));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUserRate = (req, res, next) => {
  User.findById(req.user._id)
    .select("rate")
    .orFail(() => {
      next(new NotFoundError("User not found"));
    })
    .then((user) => res.send({ rate: user.rate }))
    .catch(next);
};
