const router = require("express").Router();
const ctrl = require("../controllers/loadingController");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);
router.put("/:id/start", ctrl.start);
router.put("/:id/complete", ctrl.complete);

module.exports = router;
