const router = require("express").Router();
const { createJob, getJobs } = require("../controllers/jobs");
const { auth } = require("../middlewares/auth");
const {
  validatorCreateJob,
  validatorGetJobsByInvoice,
} = require("../middlewares/validation");

router.post("/", auth, validatorCreateJob, createJob);
router.get("/:owner", auth, validatorGetJobsByInvoice, getJobs);

module.exports = router;
