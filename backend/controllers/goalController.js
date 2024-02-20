const Goal = require("../models/goalModel");

/**
 * Get goals
 * @route GET /api/goals
 * @access private
 */
const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find();
    res.status(200).json(goals);
  } catch (err) {
    next(err);
  }
};

/**
 * Set goal
 * @route POST /api/goals
 * @access private
 */
const setGoal = async (req, res, next) => {
  try {
    if (!req.body.text) {
      res.status(400);
      throw new Error("Please add a text field");
    }
    const goal = await Goal.create({
      text: req.body.text,
      user: req.user.id,
    });
    res.status(200).json(goal);
  } catch (err) {
    next(err);
  }
};

/**
 * Update goal
 * @route PUT /api/goals/:id
 * @access private
 */
const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      res.status(400);
      throw new Error("Goal not found");
    }

    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    if (goal.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("user", "name");

    res.status(200).json(updatedGoal);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete goal
 * @route Delete /api/goals/:id
 * @access private
 */
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      res.status(400);
      throw new Error("Goal not found");
    }

    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    if (goal.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    await Goal.deleteOne(goal);

    res.status(200).json({ id: req.params.id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
