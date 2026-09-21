const router = require("express").Router();
const { recognize } = require("../controllers/anprController");
const { authenticate } = require("../middleware/auth");

router.post("/recognize", authenticate, recognize);

module.exports = router;
