import User from "../models/user.model.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(email);
  const userExists = await User.findOne({ email: email });
  console.log(userExists);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    const user = await User.create({ name, email, password });
    return res
      .status(201)
      .json({ message: "User created successfully", user: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const login = async (req, res) => {
  res.send("Ready to login");
};
export const logout = async (req, res) => {
  res.send("Ready to logout");
};
