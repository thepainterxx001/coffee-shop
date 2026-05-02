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

export const updateAdmin = async (req, res) => {
  try {
    const { name, email, currentPass, confirmPass, newPass } = req.body;
    const admin = await Admin.findById(req.params.id);

    if (currentPass || confirmPass || newPass) {
      if (!currentPass || !confirmPass || !newPass) {
        return res.status(400).json({
          message: "All password fields are required."
        });
      }

      const checkPassword =  await bcrypt.compare(currentPass, admin.password);
      if (!checkPassword)
        return res.status(400).json({ message: "Failed to update password. Please ensure your current password is correct." });

      if (newPass !== confirmPass)
        return res.status(400).json({ message: "Passwords do not match." });

      admin.password = await bcrypt.hash(newPass, 10);
    } 

    if (name) admin.name = name;
    if (email) admin.email = email;

    await admin.save();

    res.status(200).json({ message: "Admin details updated successfully." });
  } catch (err) {
    console.log("Error in updateAdmin controller", err);
    res.status(500).json({ message: "Error changing admin details, try again later." });
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
      user: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.log("Error in loginAdmin controller", err);
    res.status(500).json({ message: "Error accessing admin system, please try again." });
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