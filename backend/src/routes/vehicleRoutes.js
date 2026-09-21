const router = require("express").Router();
const ctrl = require("../controllers/vehicleController");
const { authenticate, requireRole } = require("../middleware/auth");

router.use(authenticate);
router.get("/", ctrl.list);
router.get("/:id", ctrl.getOne);
router.post("/", requireRole("admin"), ctrl.create);
router.put("/:id", requireRole("admin"), ctrl.update);
router.delete("/:id", requireRole("admin"), ctrl.deactivate);

module.exports = router;
