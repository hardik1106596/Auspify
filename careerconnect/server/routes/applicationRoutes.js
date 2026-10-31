const router = require("express").Router();
const c = require("../controllers/applicationController");
const { protect, allowRoles } = require("../middleware/auth");
router.post("/:jobId", protect, allowRoles("seeker"), c.apply);
router.get("/mine", protect, allowRoles("seeker"), c.mine);
router.get("/received", protect, allowRoles("employer", "admin"), c.received);
router.patch("/:id/status", protect, allowRoles("employer", "admin"), c.updateStatus);
module.exports = router;
