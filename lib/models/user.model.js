import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    minlength: [2, "First name must be at least 2 chars"],
    required: true,
  },
  lname: {
    type: String,
    minlength: [2, "Last name must be at least 2 chars"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 chars"],
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;