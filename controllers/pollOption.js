import PollOption from "../models/PollOption.js";

export const createPollOption = async (req, res) => {
  try {
    const { name, description, pollId } = req.body;
    //check if poll option name already exists in poll
    const findPollOption = await PollOption.find({ name, pollId });
    if (findPollOption.length > 0) {
      res.status(201).json({ message: "Name already exists" });
      return;
    }

    const newPollOption = new PollOption({
      name,
      description,
      pollId,
    });

    await newPollOption.save();
    res.status(201).json({ message: "Poll Option created succesfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPollOptions = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, sortField, sort, search = "" } = req.query;
    const sortFormatted = sort
      ? { [sortField]: sort === "asc" ? 1 : -1 }
      : null;
    //find polls that matches at least one of the conditions
    //The regex operator is used to search for specific strings in the collection, this would be
    //equivalent to: WHERE "" like "" in sql;
    const pollOptions = await PollOption.find({
      $or: [{ name: { $regex: new RegExp(search, "i") } }],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize)
      .populate({
        path: "pollId",
        select: { 'name': 1 },
      })
      .lean();

    const optionsWithPollName = pollOptions.map((option) => {
      const {pollId, ...rest} = option;
      return {...rest, pollName: pollId.name}
    });

    //get total of documents in DB
    //i option perform a case-insensitive match
    const total = await PollOption.countDocuments({
      name: { $regex: search, $options: "i" },
    });
    res.status(200).json({
      pollOptions: optionsWithPollName,
      total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPollOption = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await PollOption.findById(id).select(
      "-createdAt -updatedAt -__v -_id"
    );
    res.status(200).json(poll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePollOption = async (req, res) => {
  try {
    const pollId = req.params.id;
    const poll = req.body;
    // Update the poll in the database
    const updatedPoll = await PollOption.findByIdAndUpdate(pollId, poll, {
      new: true,
    });
    // Check if the poll was found and updated successfully
    if (!updatedPoll) {
      return res.status(404).json({ message: "Poll option not found" });
    }
    // Send the updated poll as a response
    res
      .status(200)
      .json({ poll: updatedPoll, message: "Poll option updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePollOption = async (req, res) => {
  try {
    const { id } = req.params;
    await PollOption.findByIdAndDelete(id);
    res.status(201).json({ message: "Poll deleted succesfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
