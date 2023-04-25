import User from "../models/User.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user with the given email already exists
    const findUser = await User.find({ email });
    if (findUser.length > 0) {
      res.status(201).json({ message: "Email already exists" });
      return;
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user object and save to the database
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
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, sortField, sort, search = "" } = req.query;
    const sortFormatted = sort
      ? { [sortField]: sort === "asc" ? 1 : -1 }
      : null;
    //find users that matches at least one of the conditions
    //The regex operator is used to search for specific strings in the collection, this would be
    //equivalent to: WHERE "" like "" in sql;
    const users = await User.find(
      {
        $or: [{ email: { $regex: new RegExp(search, "i") } }],
      },
      { password: 0 } // Exclude the password field
    )
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);
    //get total of documents in DB
    //i option perform a case-insensitive match
    const total = await User.countDocuments({
      email: { $regex: search, $options: "i" },
    });
    res.status(200).json({
      users,
      total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Find a user by their ID and exclude sensitive fields
    const user = await User.findById(id).select(
      "-password -createdAt -updatedAt -__v -_id"
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { password, ...rest } = req.body;
    const user = { ...rest };

    if (password) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      user.password = passwordHash;
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(userId, user, {
      new: true,
    }).select("-password -createdAt -updatedAt -__v -_id");

    // Check if the user was found and updated successfully
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the updated user as a response
    res
      .status(200)
      .json({ user: updatedUser, message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { newPassword, password, ...rest } = req.body;
    let newCredentials = { ...rest };

    //use lean to get plain javascript object
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (newPassword) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(newPassword, salt);
      newCredentials = { ...newCredentials, password: passwordHash };
    }
    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      newCredentials,
      {
        new: true,
      }
    ).select("-password -createdAt -updatedAt -__v");

    // Send the updated user as a response
    res
      .status(200)
      .json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    //find and delete user
    await User.findByIdAndDelete(id);
    res.status(201).json({ message: "User deleted succesfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
