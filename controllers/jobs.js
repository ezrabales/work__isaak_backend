const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const Job = require("../models/job");

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

  const { location, notes, paymentStatus, dateStarted, dateEnded } = req.body;

  Job.findOneAndUpdate(
    { _id: jobId, owner: userId },
    {
      location,
      notes,
      paymentStatus,
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

module.exports.deleteJob = (req, res, next) => {
  const { jobId } = req.params;
  Job.findById(jobId)
    .orFail(() => {
      next(new NotFoundError("Job not found"));
    })
    .then((job) => {
      if (req.user._id !== job.owner.toString()) {
        return next(new ForbiddenError("Not authorized"));
      }
      return Job.findByIdAndDelete(jobId).then(() =>
        res
          .status(200)
          .send({ message: "Job deleted successfully", id: jobId }),
      );
    })
    .catch((err) => {
      next(err);
    });
};
