const router = require("express").Router();
const { login, refresh, me } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

router.post("/login", login);
router.post("/refresh", refresh);
router.get("/me", authenticate, me);

module.exports = router;
