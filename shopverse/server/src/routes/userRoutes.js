
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
} from "../Controllers/profileController.js";

const router = express.Router();

// Temporary authentication test route
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "Authentication successful",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
