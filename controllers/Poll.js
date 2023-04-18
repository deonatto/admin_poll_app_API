import Poll from "../models/Poll.js";

export const createPoll = async (req, res) => {
  try {
    const { name, description, active } = req.body;
    const findPoll = await Poll.find({ name });
    if (findPoll.length > 0) {
      res.status(201).json({ message: "Poll already exists" });
      return;
    }

    const newPoll = new Poll({
      name,
      description,
      active,
    });

    await newPoll.save();
    res.status(201).json({ message: "Poll created succesfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPolls = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, sortField, sort, search = "" } = req.query;
    const sortFormatted = sort
      ? { [sortField]: sort === "asc" ? 1 : -1 }
      : null;
    //find polls that matches at least one of the conditions
    //The regex operator is used to search for specific strings in the collection, this would be
    //equivalent to: WHERE "" like "" in sql;
    const polls = await Poll.find({
      $or: [{ name: { $regex: new RegExp(search, "i") } }],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);
    //get total of documents in DB
    //i option perform a case-insensitive match
    const total = await Poll.countDocuments({
      name: { $regex: search, $options: "i" },
    });
    res.status(200).json({
      polls,
      total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPolls = async (req, res) =>{
  try {
    const polls = await Poll.find().select("-createdAt -updatedAt -__v -description");
    res.status(200).json(polls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getPoll = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findById(id).select(
      "-createdAt -updatedAt -__v -_id"
    );
    res.status(200).json(poll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePoll = async (req, res) => {
  try {
    const pollId = req.params.id;
    const poll = req.body;
    // Update the poll in the database
    const updatedPoll = await Poll.findByIdAndUpdate(pollId, poll, {
      new: true,
    });
    // Check if the poll was found and updated successfully
    if (!updatedPoll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Send the updated poll as a response
    res
      .status(200)
      .json({ poll: updatedPoll, message: "Poll updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;
    await Poll.findByIdAndDelete(id);
    res.status(201).json({ message: "Poll deleted succesfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
