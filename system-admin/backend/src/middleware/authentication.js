import e from "express";
import jwt from "jsonwebtoken";

const authentication = (role) => async (req, res, next) => {
  let token;

  if(role === "admin") token = req.cookies?.admin_token;

  if(!token) return res.status(401).json({ message: "No token, access denied." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({message: "Invalid token"});
  }
}

export default authentication;