const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const cloudinary = require("../utils/cloudinary");
const Job = require("../models/job");
const Picture = require("../models/picture");

module.exports.createJob = async (req, res, next) => {
  try {
    const lastJob = await Job.findOne().sort({ createdAt: -1 });

    const invoiceNumber = lastJob
      ? String(Number(lastJob.invoiceNumber) + 1)
      : "1000";

    const newJob = await Job.create({
      ...req.body,
      owner: req.user._id,
      invoiceNumber,
      paymentStatus: "Not Charged",
      dateEnded: "",
    });

    res.send(newJob);
  } catch (err) {
    next(err);
  }
};

module.exports.getJobs = (req, res, next) => {
  const owner = req.user._id;

  Job.find({ owner })
    .then((pictures) => res.send({ data: pictures }))
    .catch(next);
};

module.exports.updateJob = (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const {
    location,
    notes,
    email,
    paymentStatus,
    amountOwed,
    amountPaid,
    dateStarted,
    dateEnded,
  } = req.body;

  Job.findOneAndUpdate(
    { _id: jobId, owner: userId },
    {
      location,
      notes,
      email,
      paymentStatus,
      amountOwed,
      amountPaid,
      dateStarted,
      dateEnded,
    },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError("Job not found");
    })
    .then((job) => res.status(200).send(job))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("invalid data"));
      }

      next(err);
    });
};

module.exports.updateJobStatus = (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const { paymentStatus, amountPaid, amountOwed } = req.body;

  Job.findOneAndUpdate(
    { _id: jobId, owner: userId },
    {
      paymentStatus,
      amountPaid,
      amountOwed,
    },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError("Job not found");
    })
    .then((job) => res.status(200).send(job))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("invalid data"));
      }

      next(err);
    });
};

module.exports.deleteJob = async (req, res, next) => {
  try {
    const { jobId, invoiceNumber } = req.params;
    const userId = req.user._id;

    const job = await Job.findById(jobId).orFail(() => {
      throw new NotFoundError("Job not found");
    });

    if (userId !== job.owner.toString()) {
      throw new ForbiddenError("Not authorized");
    }

    const pictures = await Picture.find({
      invoiceNumber: invoiceNumber,
      owner: userId,
    });

    // Delete pictures from Cloudinary
    if (pictures.length > 0) {
      const assetIds = pictures.map((pic) => pic.assetId);

      await cloudinary.api.delete_resources_by_asset_ids(assetIds);
    }

    // Delete pictures from db
    await Picture.deleteMany({
      invoiceNumber: invoiceNumber,
      owner: userId,
    });

    await Job.findByIdAndDelete(jobId);

    res.status(200).send({ message: "Job deleted successfully", id: jobId });
  } catch (err) {
    next(err);
  }
};
