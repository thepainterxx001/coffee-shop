import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: "Admin"
  },
  email: {
    type: String,
    default: "admin@system.com",
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
  },
  password: {
    type: String,
    required: true
  }
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;