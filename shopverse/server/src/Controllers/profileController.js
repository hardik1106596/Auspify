import User from "../models/User.js";

// GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        address: req.user.address,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error.message);
    res.status(500).json({ message: "Unable to fetch profile" });
  }
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (typeof name !== "undefined" && (typeof name !== "string" || !name.trim())) {
      return res.status(400).json({
        message: "Name cannot be empty",
      });
    }

    if (typeof phone !== "undefined" && typeof phone !== "string") {
      return res.status(400).json({
        message: "Phone must be a string",
      });
    }

    if (typeof address !== "undefined" && typeof address !== "string") {
      return res.status(400).json({
        message: "Address must be a string",
      });
    }

    const updates = {};

    if (typeof name !== "undefined") updates.name = name.trim();
    if (typeof phone !== "undefined") updates.phone = phone.trim();
    if (typeof address !== "undefined") updates.address = address.trim();

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Unable to update profile" });
  }
};
