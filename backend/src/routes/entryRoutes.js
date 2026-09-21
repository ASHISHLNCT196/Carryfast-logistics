const router = require("express").Router();
const ctrl = require("../controllers/entryController");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);
router.get("/active", ctrl.listActive);
router.post("/", ctrl.createEntry);
router.post("/:id/assign-depot", ctrl.assignDepot);
router.post("/:id/assign-dock", ctrl.assignDock);

module.exports = router;
