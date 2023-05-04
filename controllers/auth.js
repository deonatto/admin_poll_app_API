import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER
export const register = async (req, res) => {
  try {
    // Extract required user details from request body
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user with given email already exists
    const findUser = await User.find({ email });
    if (findUser.length > 0) {
      // If user already exists, return error response
      res.status(201).json({ message: "Email already exists" });
      return
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user object
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      role,
    });

    // Save the user object to the database
    await newUser.save();
    res.status(201).json({ message: "User created succesfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//LOGIN
export const login = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Find the user with the given email in the database
    //use lean to get plain javascript object to be able to delete password before sending obj to FE
    const user = await User.findOne({ email }).lean();
    if (!user) {
      // If user not found, return error response
      return res.status(400).json({ message: "User does not exist." });
    }

    // Compare the given password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If passwords do not match, return error response
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // If passwords match, generate a JSON Web Token (JWT) with user ID
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Delete password from user object before sending to frontend
    delete user.password;
    
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
