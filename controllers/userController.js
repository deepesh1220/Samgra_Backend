/*
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/userModel');
const { jwtSecret } = require('../config/config');
const sendEmail = require('../utils/email');
const successResponse = require('../utils/successResponse');
const customError = require('../utils/customError');


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
    if (!user) return res.status(404).json({ status: 0, message: 'Invalid email ID' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ status: 0, message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await user.update({ refreshToken });

    res.status(200).json({
      status: 1,
      message: 'Login successful',
      data:{
        userLevel: user.userLevel,
        name: user.username,
        email: user.email,
        mobile: user.mobileNo,
        bio: user.bio,
      },
     // accessToken,
      token: user.refreshToken,
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
*/
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/userModel');
const { jwtSecret } = require('../config/config');
const sendEmail = require('../utils/email');
const successResponse = require('../utils/successResponse');
const customError = require('../utils/customError');
const errorResponse = require('../utils/errorResponse');
const SchoolUdise = require('../models/school_udise');

const roleMapping = {
  'superAdmin': 1,
  'admin': 2,
  'subAdmin': 3,
  'user': 4,
};

const userLevelMapping = {
  'state': 22,
  'district': 23,
  'block': 24,
  'cluster': 25,
  'school': 26,
  'other': 27,
};

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

const signup = async (req, res, next) => {
  const { username, email,bio,districtName,blockName,address,mobileNo,alternateMobileNo, password, role,userLevel,accessId } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new customError('Email already taken',409)
     // return errorResponse(res, 409, 'Email already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await generateUserId();
    const newUser = await User.create({
      userId,
      username,
      email,
      bio,
      districtName,
      blockName,
      address,
      mobileNo,
      alternateMobileNo,
      password: hashedPassword,
      role: role || 'user',
      roleId: roleMapping[role] || 4,
      userLevel: userLevel || 'other',
      userLevelId: userLevelMapping[userLevel] || 27,
      accessId: accessId || 4,
      
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    await newUser.update({ refreshToken });

    successResponse(res, 201, 'Signup successful', {
      userId: newUser.userId,
      username: newUser.username,
      email: newUser.email,
      bio: newUser.bio,
      districtName: newUser.districtName,
      blockName: newUser.blockName,
      address: newUser.address,
      mobileNo: newUser.mobileNo,
      alternateMobileNo: newUser.alternateMobileNo,
      role: newUser.role,
      roleId: newUser.roleId,
      userLevel: newUser.userLevel,
      userLevelId: newUser.userLevelId,
      accessId: newUser.accessId,
      //accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error.message);
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
   // res.status(500).json({ message: error.message });
  }
};

/*
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
          throw new customError('Invalid email Id',404)
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          throw new customError('Invalid credentials',401);
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      await user.update({ refreshToken });

      return successResponse(res, 200, 'Login successful', {
          userLevel: user.userLevel,
          username: user.username,
          email: user.email,
          mobile: user.mobileNo,
          alternateMobileNo: user.alternateMobileNo,
          bio: user.bio,
          role: user.role,
          roleId: user.roleId,
          userLevel: user.userLevel,
          userLevelId: user.userLevelId,
          accessId: user.accessId,
          refreshToken,
      });
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
      // return errorResponse(res, 500, 'Internal server error', error.message);
  }
};
*/

const login = async (req, res, next) => {
  let user;
  let details;
  const { email, password, udise_sch_code, district_cd, block_cd, cluster_cd, mobileNo } = req.body;

  try {
    if (email) {
      user = await User.findOne({ where: { email } });
      if (!user) {
        throw new customError('Invalid email Id', 404);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new customError('Invalid credentials', 401);
      }

      // Fetch user details from user table
      details = {
        username: user.username,
        email: user.email,
        mobile: user.mobileNo,
        alternateMobileNo: user.alternateMobileNo,
        bio: user.bio,
        role: user.role,
        roleId: user.roleId,
        userLevel: user.userLevel,
        userLevelId: user.userLevelId,
        accessId: user.accessId,
      };
    } else {
      // multiple login field
      const loginConditions = [
        { field: 'udise_sch_code', value: udise_sch_code },
        { field: 'district_cd', value: district_cd },
        { field: 'block_cd', value: block_cd },
        { field: 'cluster_cd', value: cluster_cd },
        { field: 'mobileNo', value: mobileNo }
      ];

      let isValidLoginField = false;
      for (const condition of loginConditions) {
        if (condition.value) {
          user = await SchoolUdise.findOne({ where: { [condition.field]: condition.value } });
          if (user) {
            if (password !== condition.value.toString()) {
              throw new customError('Invalid credentials', 401);
            }
            isValidLoginField = true;
            break;
          }
        }
      }
      if(!user){
        throw new customError('user not found',404);
      }

      if (!isValidLoginField) {
        throw new customError('No valid login field provided', 400);
      }

      // Fetch user details from school_udise table
      details = {
        district_cd: user.district_cd,
        district_name: user.district_name,
        block_cd: user.block_cd,
        block_name: user.block_name,
        cluster_cd: user.cluster_cd,
        cluster_name: user.cluster_name,
        lgd_ward_id: user.lgd_ward_id,
        lgd_ward_name: user.lgd_ward_name,
        lgd_village_id: user.lgd_village_id,
        lgd_vill_name: user.lgd_vill_name,
        udise_sch_code: user.udise_sch_code,
        school_name: user.school_name,
        assembly_cons_cd: user.assembly_cons_cd,
        assembly_name: user.assembly_name,
        sch_loc_r_u: user.sch_loc_r_u,
        sch_category_id: user.sch_category_id,
        sch_type: user.sch_type,
        sch_mgmt_id: user.sch_mgmt_id,
        latitude: user.latitude,
        longitude: user.longitude,
      };
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    if (user instanceof User) {
      await user.update({ refreshToken });
    }

    return successResponse(res, 200, 'Login successful', {
      details,
      accessToken,
      refreshToken,
    });
  } catch (error) {
 //   console.error(error); 
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError('An unexpected error occurred', 500);
    return genericError.sendErrorResponse(res);
  }
};


const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new customError('User not found',404)
    }
    user.refreshToken = null;
    await user.save();

    successResponse(res, 200, 'Logged out successfully');
  } catch (error) {

    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  //  res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new customError('User not found',404)
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new customError('Old password is incorrect',401)
    }
    
    // if (password === null || newPassword === null) {
    //   throw new customError('Password or new password is null. Please provide valid values.', 401);
    // }
    
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    successResponse(res, 200, 'Password updated successfully');
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  //  res.status(500).json({ message: error.message });
  }
};

// change password filed of all
// const changePassword = async (req, res, next) => {
//   const { oldPassword, newPassword, loginField } = req.body; // `loginField` determines which field was used to log in
//   const userId = req.user?.id; // `req.user` should contain the logged-in user info, depending on your auth middleware

//   try {
//     let user;

//     // Check if the user logged in via the `users` table
//     if (loginField === 'email' && userId) {
//       user = await User.findByPk(userId);
//       if (!user) {
//         throw new customError('User not found', 404);
//       }

//       const isMatch = await bcrypt.compare(oldPassword, user.password);
//       if (!isMatch) {
//         throw new customError('Old password is incorrect', 401);
//       }

//       // Update password for the `users` table
//       user.password = await bcrypt.hash(newPassword, 10);
//       await user.save();

//       return successResponse(res, 200, 'Password updated successfully for user');
//     }

//     // Check if the user logged in via the `school_udise` table
//     const loginConditions = [
//       { field: 'udise_sch_code', value: req.body.udise_sch_code },
//       { field: 'district_cd', value: req.body.district_cd },
//       { field: 'block_cd', value: req.body.block_cd },
//       { field: 'cluster_cd', value: req.body.cluster_cd },
//       { field: 'mobileNo', value: req.body.mobileNo },
//     ];

//     for (const condition of loginConditions) {
//       if (condition.value) {
//         user = await SchoolUdise.findOne({
//           where: { [condition.field]: condition.value },
//         });
//         if (user) {
//           if (oldPassword !== condition.value.toString()) {
//             throw new customError('Old password is incorrect', 401);
//           }

//           // Update password logic for `school_udise`
//           user.password = await bcrypt.hash(newPassword, 10); // If `password` field is not present in the `school_udise` table, use the relevant field for update.
//           await user.save();

//           return successResponse(res, 200, 'Password updated successfully for school_udise');
//         }
//       }
//     }

//     throw new customError('User not found or invalid login field provided', 404);
//   } catch (error) {
//     if (error instanceof customError) {
//       return error.sendErrorResponse(res);
//     }
//     const genericError = new customError('An unexpected error occurred', 500);
//     return genericError.sendErrorResponse(res);
//   }
// };


const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new customError('User not found',404)
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const message = `From Samgra Siksha Mandal Raipur (C.G.) your OTP for password reset is ${otp}. It is valid for 10 minutes.`;
    await sendEmail({ email: user.email, subject: 'Password Reset OTP', message });

    successResponse(res, 200, 'OTP sent to email successfully');
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  //  res.status(500).json({ message: error.message });
  }
};

const verifyPasswordOTP = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new customError('User not found',404)
    }
    if (!user.otp || user.otp !== otp) {
      throw new customError('Invalid OTP', 401);
    }
    
    if (!user.otpExpires || user.otpExpires < new Date()) {
      throw new customError('OTP has expired', 401);
    }

    successResponse(res, 200, 'OTP verified successfully');
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  //  res.status(500).json({ message: error.message });
  }
};

const changePasswordByOtp = async (req, res, next) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.otpExpires < new Date()) {
      throw new customError('Invalid or expired OTP',401)
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    successResponse(res, 200, 'Password reset successfully');
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
  }
};

const updateRole = async (req, res, next) => {
  const { userId, newRole } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new customError('User not found',404);
    }

    user.role = newRole;
    await user.save();

    successResponse(res, 200, 'User role updated successfully', { userId, newRole });
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
       // res.status(500).json({ message: error.message });
  }
};

const editUser = async (req, res, next) => {
  const { userId, updates } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new customError('User not found',404);
    }

    await user.update(updates);

    successResponse(res, 200, 'User updated successfully', user);
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
       // res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res, next) => {
  const { userId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new customError('User not found',404);
    }

    await user.destroy();

    successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
       // res.status(500).json({ message: error.message });
  }
};

const registerUserByAdmin = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new customError('Email already taken',409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await generateUserId();

    const newUser = await User.create({
      userId,
      username,
      email,
      password: hashedPassword,
      role,
    });

    successResponse(res, 201, 'User registered successfully by admin', newUser);
  } catch (error) {
    if (error instanceof customError) {
      return error.sendErrorResponse(res);
    }
    const genericError = new customError();
    return genericError.sendErrorResponse(res);
       // res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
  changePassword,
  forgotPassword,
  verifyPasswordOTP,
  changePasswordByOtp,
  updateRole,
  editUser,
  deleteUser,
  registerUserByAdmin,
};
