import express from "express";
import { newAdmin, loginAdmin } from "../controller/authController.js";
import authentication from "../middleware/authentication.js";
import Admin from "../../models/admin.js";

const router = express.Router();

router.post("/new-admin", newAdmin);
router.post("/login-admin", loginAdmin);
router.get("/access-admin", authentication("admin"), async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if(!admin) return res.status(404).json({ message: "Cannot access admin, make sure your token is valid."});

    res.status(200).json({ message: "Welcome to Admin System", admin: { id: admin._id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ messgae: "Server error, try again" });
  }
});

export default router;