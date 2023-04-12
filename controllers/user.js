import User from "../models/User.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const findUser = await User.find({ email });
    if (findUser.length > 0) {
      res.status(201).json({ message: "Email already exists" });
      return;
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
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    //sort sent by MUI should look like this: {"field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sortField, sort, search = "" } = req.query;
    const sortFormatted = sort
      ? { [sortField]: sort === "asc" ? 1 : -1 }
      : null;
    //find users that matches at least one of the conditions
    //The regex operator is used to search for specific strings in the collection, this would be
    //equivalent to: WHERE "" like "" in sql;
    const users = await User.find(
      {
        $or: [
          { email: { $regex: new RegExp(search, "i") } },
        ],
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
      total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(201).json({ message: "User deleted succesfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
