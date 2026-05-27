const job = require("../models/job");

module.exports.createJob = async (req, res, next) => {
  try {
    const lastJob = await job.findOne().sort({ createdAt: -1 });

    const invoiceNumber = lastJob
      ? String(Number(lastJob.invoiceNumber) + 1)
      : "1000";

    const newJob = await job.create({
      ...req.body,
      owner: req.user._id,
      invoiceNumber,
      paymentStatus: "Not Charged",
    });

    res.send(newJob);
  } catch (err) {
    next(err);
  }
};

module.exports.getJobs = (req, res, next) => {
  const { owner } = req.params;

  jobs
    .find({ owner })
    .then((pictures) => res.send({ data: pictures }))
    .catch(next);
};
