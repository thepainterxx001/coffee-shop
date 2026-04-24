import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../../models/admin.js";

export const newAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if(!username || !password) 
      return res.status(400).json({ message: "All fields are required." });

    const usernameExists = await Admin.findOne({ username });
    if (usernameExists)
      return res.status(400).json({ message: `${username} already taken.` });

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({ username, password: hashedPassword });

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.log("Error in newAdmin controller", err);
    res.status(500).json({ message: "Internal server error." });
  } 
}

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if(!username || !password) 
      return res.status(400).json({ message: "All fields are required." });

    const admin = await Admin.findOne({ username });
    if (!admin)
      return res.status(400).json({ message: `Invalid username.` });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) 
      return res.status(400).json({ message: `Invaliud password.` });

    const token = jwt.sign(
      {id: admin._id},
      process.env.JWT_SECRET,
      {expiresIn: "7D"}
    );

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: false, //false muna kase development palang naman
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Admin access granted.",
      user: { id: admin._id }
    });
  } catch (err) {
    console.log("Error in loginAdmin controller", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("admin_token", {
      httpOnly: true,
      sameSite: "lax",
      secure: true
    });
    res.status(200).json({ message: "Admin logged out." });
  } catch (err) {
    console.log("Error in logoutAdmin controller", err);
    res.status(500).json({ message: "Internal server error." });
  }
}