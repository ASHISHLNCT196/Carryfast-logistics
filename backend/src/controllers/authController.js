const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ where: { email } });
    if (!user || user.status !== "active") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "refreshToken is required" });

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ error: "Invalid refresh token" });

    const accessToken = signAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ["id", "name", "email", "role", "status"] });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { login, refresh, me };
