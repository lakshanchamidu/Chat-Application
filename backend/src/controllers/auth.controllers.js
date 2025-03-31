import { generateToken } from "../../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    //hash Password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at t 6 characters" });
    }
    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email akready  exist" });

    const salt = await bcrypt.getSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fulName: fullname,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fulName: fullname,
        email: email,
        profilrPic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internel Server Error" });
  }
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
