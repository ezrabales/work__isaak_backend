const picture = require("../models/picture");

module.exports.createPicture = (req, res, next) => {
  const { src, description, invoiceNumber } = req.body;

  picture
    .create({
      src,
      description,
      invoiceNumber,
      owner: req.user._id,
    })
    .then((data) => res.status(201).send(data))
    .catch(next);
};

module.exports.getPictures = (req, res, next) => {
  const { invoiceNumber } = req.params;

  picture
    .find({ invoiceNumber })
    .then((pictures) => res.send({ data: pictures }))
    .catch(next);
};
