const router = require("express").Router();
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");
const { auth } = require("../middlewares/auth");
const {
  validatorCreateJob,
  validatorUpdateJob,
} = require("../middlewares/validation");

router.post("/", auth, validatorCreateJob, createJob);
router.get("/", auth, getJobs);
router.patch("/:jobId", auth, validatorUpdateJob, updateJob);
router.delete("/:jobId", auth, deleteJob);

module.exports = router;
