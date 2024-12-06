
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/userModel');
const { jwtSecret } = require('../config/config');
const sendEmail = require('../utils/email');


const generateAccessToken = (user) => {
  const payload = { id: user.userId, email: user.email, role: user.role };
  return jwt.sign(payload, jwtSecret, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  const payload = { id: user.userId };
  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const generateUserId = async () => {
  const lastUser = await User.findOne({ order: [['createdAt', 'DESC']] });
  const lastId = lastUser?.userId || 0;
  return lastId + 1;
};

const signup = async (req, res) => {
  const { username, email, mobileNo, alternateMobileNo, bio, districtName, blockName, address, password, role, userLevel,accessId } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ status: '0', message: 'Email already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role && ['user', 'admin', 'subAdmin', 'superAdmin'].includes(role) ? role : 'user';
    const userId = await generateUserId();

    const newUser = await User.create({
      userId,
      username,
      email,
      mobileNo,
      alternateMobileNo,
      bio,
      districtName,
      blockName,
      address,
      password: hashedPassword,
      role: userRole,
      userLevel,
      accessId,
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    await newUser.update({ refreshToken });

    res.status(201).json({
      status: '1',
      message: 'Signup successful',
      user: { userId: newUser.userId, username: newUser.username, email: newUser.email, role: newUser.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ status: '0', message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ status: '0', message: 'Invalid email ID' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ status: '0', message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await user.update({ refreshToken });

    res.status(200).json({
      status: '1',
      message: 'Login successful',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ status: '0', message: 'Server error' });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ status: '0', message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ status: '0', message: 'Old password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ status: '1', message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ status: '0', message: 'Server error' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ status: '0', message: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const message = `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`;
    await sendEmail({ email: user.email, subject: 'Password Reset OTP', message });

    res.status(200).json({ status: '1', message: 'OTP sent to email successfully' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ status: '0', message: 'Server error' });
  }
};

const verifyPasswordOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(401).json({ status: '0', message: 'Invalid or expired OTP' });
    }

    res.status(200).json({ status: '1', message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error.message);
    res.status(500).json({ status: '0', message: 'Server error' });
  }
};

const changePasswordByOtp = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.otpExpires < new Date()) {
      return res.status(401).json({ status: '0', message: 'Invalid or expired OTP session' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ status: '1', message: 'Password reset successfully' });
  } catch (error) {
    console.error('Change password by OTP error:', error.message);
    res.status(500).json({ status: '0', message: 'Server error' });
  }
};

const updateRole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    if (!['admin', 'superAdmin'].includes(role)) {
      return res.status(400).json({ status: '0', message: 'Invalid role provided' });
    }
    const user = await User.findOne({ where: { userId } });
    if (!user) return res.status(404).json({ status: '0', message: 'User not found' });

    user.role = role;
    await user.save();

    res.status(200).json({
      status: '1',
      message: 'User role updated successfully',
      user: { id: user.userId, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Role update error:', error.message);
    res.status(500).json({ status: '0', message: 'Server error' });
  }
};

const editUser = async (req, res) => {
  const { userId, username, email, mobileNo, alternateMobileNo, bio, districtName, blockName, address, role, userLevel } = req.body;

  try {

    if (!['superAdmin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ status: '0', message: 'Access denied' });
    }

    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json({ status: '0', message: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.mobileNo = mobileNo || user.mobileNo;
    user.alternateMobileNo = alternateMobileNo || user.alternateMobileNo;
    user.bio = bio || user.bio;
    user.districtName = districtName || user.districtName;
    user.blockName = blockName || user.blockName;
    user.address = address || user.address;
    user.role = role || user.role;
    user.userLevel = userLevel || user.userLevel;

    await user.save();

    res.status(200).json({ status: '1', message: 'User updated successfully', user });
  } catch (error) {
    console.error('Edit user error:', error.message);
    res.status(500).json({ status: '0', message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!['superAdmin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ status: '0', message: 'Access denied' });
    }

    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json({ status: '0', message: 'User not found' });
    }

    await user.destroy();

    res.status(200).json({ status: '1', message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ status: '0', message: 'Server error' });
  }
};

const registerUserByAdmin = async (req, res) => {
  const { username, email, mobileNo, alternateMobileNo, bio, districtName, blockName, address, password, role, userLevel,accessId } = req.body;

  try {

    if (!['superAdmin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ status: '0', message: 'Access denied' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ status: '0', message: 'Email already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role && ['user', 'admin', 'subAdmin', 'superAdmin'].includes(role) ? role : 'user';
    const userId = await generateUserId();

    const newUser = await User.create({
      userId,
      username,
      email,
      mobileNo,
      alternateMobileNo,
      bio,
      districtName,
      blockName,
      address,
      password: hashedPassword,
      role: userRole,
      userLevel,
      accessId,
    });

    res.status(201).json({ status: '1', message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Register user by admin error:', error.message);
    res.status(500).json({ status: '0', message: 'Server error' });
  }
};


const logout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      await user.update({ refreshToken: null });
      res.status(200).json({ message: 'Logout successfully!' });
    } else {
      res.status(404).json({ message: 'User not found!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const protectedRoute = (req, res) => {
  try {
    res.status(200).json({ status: '1', message: `Hello ${req.user.username}!, welcome to the protected route!` });
  } catch (error) {
    res.status(500).json({ status: '0', message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  changePassword,
  forgotPassword,
  verifyPasswordOTP,
  changePasswordByOtp,
  updateRole,
  logout,
  protectedRoute,
  editUser, 
  deleteUser, 
  registerUserByAdmin, 
};

