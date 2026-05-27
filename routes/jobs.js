const router = require("express").Router();
const { createJob, getJobs, updateJob } = require("../controllers/jobs");
const { auth } = require("../middlewares/auth");
const {
  validatorCreateJob,
  validatorUpdateJob,
} = require("../middlewares/validation");

router.post("/", auth, validatorCreateJob, createJob);
router.get("/", auth, getJobs);
router.patch("/:jobId", auth, validatorUpdateJob, updateJob);

module.exports = router;
