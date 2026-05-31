const NotFoundError = require("../errors/NotFoundError");
const Picture = require("../models/picture");
const cloudinary = require("../utils/cloudinary");

module.exports.createPicture = (req, res, next) => {
  const { src, description, assetId, invoiceNumber } = req.body;

  Picture.create({
    src,
    description,
    assetId,
    invoiceNumber,
    owner: req.user._id,
  })
    .then((data) => res.status(201).send(data))
    .catch(next);
};

module.exports.getPictures = (req, res, next) => {
  const { invoiceNumber } = req.params;

  Picture.find({ invoiceNumber })
    .then((pictures) => res.send({ data: pictures }))
    .catch(next);
};

module.exports.deletePicture = async (req, res, next) => {
  try {
    const { picId } = req.params;
    const userId = req.user._id;

    const picture = await Picture.findById(picId).orFail(() => {
      throw new NotFoundError("Picture not found");
    });

    // Verify ownership
    if (picture.owner.toString() !== userId.toString()) {
      throw new ForbiddenError("Not authorized");
    }

    // Delete from Cloudinary
    if (picture.assetId) {
      await cloudinary.api.delete_resources_by_asset_ids([picture.assetId]);
    }

    // Delete from database
    await Picture.findByIdAndDelete(picId);

    res.status(200).send({
      message: "Picture deleted successfully",
      id: picId,
    });
  } catch (err) {
    next(err);
  }
};
