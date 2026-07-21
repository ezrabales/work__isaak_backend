const router = require("express").Router();
const {
  createJob,
  getJobs,
  updateJob,
  updateJobStatus,
  deleteJob,
} = require("../controllers/jobs");
const { auth } = require("../middlewares/auth");
const {
  validatorCreateJob,
  validatorUpdateJob,
  validatorUpdateJobStatus,
} = require("../middlewares/validation");
const { deleteJobRestrictions } = require("../middlewares/testerRestrictions");

router.post("/", auth, validatorCreateJob, createJob);
router.get("/", auth, getJobs);
router.patch("/:jobId", auth, validatorUpdateJob, updateJob);
router.patch("/status/:jobId", auth, validatorUpdateJobStatus, updateJobStatus);
router.delete("/:jobId/:invoiceNumber", auth, deleteJobRestrictions, deleteJob);

module.exports = router;
