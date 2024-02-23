const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

/**
 * Register new user
 * @route POST /api/users
 * @access public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const userExits = await User.findOne({ email });

    if (userExits) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Hash password
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        throw new Error(err.message);
      }

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      if (user) {
        res.status(201).json({
          _id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(400);
        throw new Error("Invalid User data");
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Authenticate a user
 * @route POST /api/users/login
 * @access private
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Get user data
 * @route GET /api/users/me
 * @access private
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    next(err);
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
