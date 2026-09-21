const router = require("express").Router();
const { createExit } = require("../controllers/exitController");
const { authenticate } = require("../middleware/auth");

router.post("/", authenticate, createExit);

module.exports = router;
