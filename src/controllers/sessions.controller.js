import jwt from "jsonwebtoken";
import config from "../config/config.js";
import UserDTOSession from "../DTO/UserParsed.js";

const register = async (req, res) => {
  res.json({ status: "success", message: "registered" });
};

const login = async (req, res) => {
  const sessionUser = new UserDTOSession(req.user);

  const sessionUserObject = { ...sessionUser };

  const token = jwt.sign(sessionUserObject, config.app.JWT.KEY, {
    expiresIn: 60 * 60, // 1 hora
  });

  res.cookie("sid", token, { httpOnly: true }).json({
    status: "success",
    message: "logged",
  });
};

const logout = (req, res) => {
  for (const cookie in req.cookies) {
    res.clearCookie(cookie);
  }

  res.json({ status: "success", message: "Logged out" });
};

const current = (req, res) => {
  if (!req.user) {
    return res.status(400).json({
      status: "error",
      error: "USER_NOT_LOGGED",
      message: "not logged in",
    });
  }

  res.json(req.user);
};

export default {
  register,
  login,
  logout,
  current,
};
