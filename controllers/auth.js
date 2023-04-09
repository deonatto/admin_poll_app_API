import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const findUser = User.find({ email });
    if (findUser) {
      res.status(201).json({ message: "Email already exists" });
      return
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User created succesfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

//LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //use lean to get plain javascript object to be able to delete password before sending obj to FE
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
