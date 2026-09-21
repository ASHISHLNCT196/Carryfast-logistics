const router = require("express").Router();
const ctrl = require("../controllers/dockController");
const { authenticate, requireRole } = require("../middleware/auth");

router.use(authenticate);
router.get("/", ctrl.list);
router.post("/", requireRole("admin"), ctrl.create);
router.put("/:id/status", ctrl.updateStatus);

module.exports = router;
