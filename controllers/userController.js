
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const UserSchema = require('../models/userModel');
// const config = require('../config/config');
// const sendEmail = require('../utils/email');

// const generateToken = (user) => {
//   const payload = { user: { id: user._id, username: user.username } };
//   return jwt.sign(payload, config.jwtSecret, { expiresIn: '3h' });
// };

// // status code =>  false = 0, true = 1

// const signup = async (req, res) => {
//   const { username, password, mobile, email } = req.body;

//   try {
//     let user = await UserSchema.findOne({ username });
//     if (user) {
//       return res.status(200).json({ 
//         status: '0',
//          message: 'Username already taken' 
//         });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     user = new UserSchema({
//       success: 'true',
//       username,
//       mobile,
//       email,
//       password: hashedPassword
//     });

//     await user.save();

//     const token = generateToken(user);

//     res.status(201).json({ 
//       status: '1',
//       message: 'success',
//        user 
//       });
//   } catch (err) {
//     console.error('Signup error:', err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const login = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await UserSchema.findOne({ username });
//     if (!user) {
//       return res.status(200).json({ 
//         status: '0',
//         message: 'User not found' 
//         });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(200).json({ 
//         status: '0', 
//         message: 'Invalid credentials' 
//       });
//     }

//     const token = generateToken(user);

//     res.json({ 
//       status: '1', 
//       message: 'success', 
//       token 
//     });
//   } catch (err) {
//     console.error('Login error:', err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const changePassword = async (req, res) => {
//   const { oldPassword, newPassword } = req.body;
//   const userId = req.user.id;

//   try {
//     const user = await UserSchema.findById(userId);
//     if (!user) {
//       return res.status(200).json({ 
//         status: '0', 
//         message: 'User not found' 
//       });
//     }

//     // Verify old password
//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(200).json({ 
//         status: '0', 
//         message: 'Old password is incorrect' 
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);
//     await user.save();

//     res.json({ 
//       status: '1', 
//       message: 'Password updated successfully' 
//     });
//   } catch (err) {
//     console.error('Password change error:', err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Protected route for testing authentication
// const protectedRoute = (req, res) => {
//   res.json({ status: '1', message: `Hello, ${req.user.username}! Welcome to the protected route.` });
// };


// const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await UserSchema.findOne({ email });
//     if (!user) {
//       return res.status(200).json({ 
//         status: '0', 
//         message: 'User not found' 
//       });
//     }

//     const otp = generateOTP();
//     user.otp = otp;
//     user.otpExpires = Date.now() + 10 * 60 * 1000;

//     await user.save();

//     const message = `Your TTMS (Teacher Training Management System) forget password  OTP is ${otp}. It is valid for only 10 minutes.`;
//     await sendEmail({
//       email: user.email,
//       subject: 'Password Reset OTP',
//       message,
//     });

//     res.status(201).json({ 
//       status: '1', 
//       message: 'OTP sent to email successfully !' 
//     });
//   } catch (err) {
//     console.error('Error requesting password reset:', err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// const verifyPasswordOTP = async (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     return res.status(400).json({status: '0',message: 'Email and OTP are required',});
//   }

//   try {
//     const user = await UserSchema.findOne({ email });

//     if (!user) {
//       return res.status(404).json({status: '0',message: 'User not found'});
//     }

//     if (user.otp !== otp) {
//       return res.status(400).json({status: '0',message: 'Invalid OTP',});
//     }

//     if (user.otpExpires <= Date.now()) {
//       return res.status(400).json({status: '0',message: 'OTP has expired'});
//     }

//     res.status(200).json({status: '1',message: 'OTP verified successfully!'});
//   } catch (err) {
//     console.error('Error verifying OTP:', err.message);
//     res.status(500).json({
//       status: '0',
//       message: 'Server error',
//     });
//   }
// };


// const changePasswordByOtp = async (req, res) => {
//   const { email, newPassword } = req.body;

//   try {
//     const user = await UserSchema.findOne({ email });
//     if (!user || !user.otpExpires || user.otpExpires < Date.now()) {
//       return res.status(200).json({ 
//         status: '0', 
//         message: 'Invalid or expired OTP session' 
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);

//     user.otp = undefined;
//     user.otpExpires = undefined;

//     await user.save();

//     res.status(201).json({ 
//       status: '1', 
//       message: 'Password reset successfully' 
//     });
//   } catch (err) {
//     console.error('Error resetting password:', err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   signup,
//   login,
//   changePassword,
//   protectedRoute,
//   forgotPassword,
//   verifyPasswordOTP,
//   changePasswordByOtp,
// };

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');
// const config = require('../config/config');
// const sendEmail = require('../utils/email');

// const generateToken = (user) => {
//   const payload = { user: { id: user.id, username: user.username } };
//   return jwt.sign(payload, config.jwtSecret, { expiresIn: '3h' });
// };

// const { Op } = require('sequelize'); 

// const signup = async (req, res) => {
//   const { username, password, mobile, email } = req.body;

//   try {
//     // Check for existing user by username or email in a single query using OR condition
//     const existingUser = await User.findOne({
//       where: {
//         [Op.or]: [{ username }, { email }],
//       },
//     });

//     if (existingUser) {
//       const message = existingUser.username === username 
//         ? 'Username already taken' 
//         : 'Email ID is already taken';

//       return res.status(200).json({
//         status: '0',
//         message,
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({
//       username,
//       mobile,
//       email,
//       password: hashedPassword,
//     });

//     const token = generateToken(newUser);

//     res.status(201).json({
//       status: '1',
//       message: 'Signup successful',
//       user: {
//         id: newUser.id,
//         username: newUser.username,
//         email: newUser.email,
//         mobile: newUser.mobile,
//       },
//       token,
//     });
//   } catch (err) {
//     console.error('Signup error:', err.message);
//     res.status(500).json({ 
//       status: '0', 
//       message: 'Server error' 
//     });
//   }
// };


// const login = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ where: { username } });
//     if (!user) {
//       return res.status(200).json({ status: '0', message: 'User not found' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(200).json({ status: '0', message: 'Invalid credentials' });
//     }

//     const token = generateToken(user);
//     res.status(200).json({ status: '1', message: 'success', token });
//   } catch (error) {
//     console.error('Login error:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const changePassword = async (req, res) => {
//   const { oldPassword, newPassword } = req.body;
//   const userId = req.user.id;

//   try {
//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(200).json({ status: '0', message: 'User not found' });
//     }

//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(200).json({ status: '0', message: 'Old password is incorrect' });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({ status: '1', message: 'Password updated successfully' });
//   } catch (error) {
//     console.error('Password change error:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const protectedRoute = (req, res) => {
//   res.status(200).json({ status: '1', message: `Hello, ${req.user.username}! Welcome to the protected route.` });
// };

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(200).json({ status: '0', message: 'User not found' });
//     }

//     const otp = generateOTP();
//     user.otp = otp;
//     user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     await user.save();

//     const message = `Your TTMS forget password OTP is ${otp}. It is valid for only 10 minutes.`;
//     await sendEmail({
//       email: user.email,
//       subject: 'Password Reset OTP',
//       message,
//     });

//     res.status(201).json({ status: '1', message: 'OTP sent to email successfully!' });
//   } catch (error) {
//     console.error('Error requesting password reset:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const verifyPasswordOTP = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user || user.otp !== otp || user.otpExpires < new Date()) {
//       return res.status(200).json({ status: '0', message: 'Invalid or expired OTP' });
//     }

//     res.status(200).json({ status: '1', message: 'OTP verified successfully!' });
//   } catch (error) {
//     console.error('Error verifying OTP:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const changePasswordByOtp = async (req, res) => {
//   const { email, newPassword } = req.body;

//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user || user.otpExpires < new Date()) {
//       return res.status(200).json({ status: '0', message: 'Invalid or expired OTP session' });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     user.otp = null;
//     user.otpExpires = null;

//     await user.save();

//     res.status(201).json({ status: '1', message: 'Password reset successfully' });
//   } catch (error) {
//     console.error('Error resetting password:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   signup,
//   login,
//   changePassword,
//   protectedRoute,
//   forgotPassword,
//   verifyPasswordOTP,
//   changePasswordByOtp,
// };

/*
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/userModel');
const { jwtSecret } = require('../config/config');
const sendEmail = require('../utils/email');

const generateToken = (user) => {
  const payload = { user: { id: user.id, email: user.email, role: user.role } };
  return jwt.sign(payload, jwtSecret, { expiresIn: '1min' });
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const signup = async (req, res) => {
  const { username, email,mobileNo , bio,location, address ,password,role,accessLevel } = req.body;

  try {

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(200).json({
        status: '0',
        message: 'Email is already taken',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role && ['user', 'admin','subAdmin', 'superAdmin'].includes(role) ? role : 'user';

    const newUser = await User.create({
      username,
      email,
      mobileNo,
      bio,
      location,
      address,
      password: hashedPassword,
      role: userRole,
      accessLevel
    });

    const token = generateToken(newUser);

    res.status(201).json({
      status: '1',
      message: 'Signup successful',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        accessLevel: newUser.accessLevel,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({
      status: '0',
      message: 'Server error',
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({
        status: '0',
        message: 'Invalid email Id',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({
        status: '0',
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      status: '1',
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      status: '0',
      message: 'Server error',
    });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(200).json({
        status: '0',
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(200).json({
        status: '0',
        message: 'Old password is incorrect',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: '1',
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({
      status: '0',
      message: 'Server error',
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({
        status: '0',
        message: 'User not found',
      });
    }

   
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration
    await user.save();


    const message = `Your TTMS OTP is ${otp}. It is valid for 10 minutes.`;
    await sendEmail({
      email: user.email,
      subject: 'Password Reset OTP',
      message,
    });

    res.status(200).json({
      status: '1',
      message: 'OTP sent to email successfully',
    });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({
      status: '0',
      message: 'Server error',
    });
  }
};

const verifyPasswordOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(200).json({
        status: '0',
        message: 'Invalid or expired OTP',
      });
    }

    res.status(200).json({
      status: '1',
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Verify OTP error:', error.message);
    res.status(500).json({
      status: '0',
      message: 'Server error',
    });
  }
};

const changePasswordByOtp = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
 
    const user = await User.findOne({ where: { email } });
    if (!user || user.otpExpires < new Date()) {
      return res.status(200).json({
        status: '0',
        message: 'Invalid or expired OTP session',
      });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      status: '1',
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Change password by OTP error:', error.message);
    res.status(500).json({
      status: '0',
      message: 'Server error',
    });
  }
};

const updateRole = async (req, res) => {
  const { userId, role } = req.body;

  if (!['user', 'admin','subAdmin', 'superAdmin'].includes(role)) {
    return res.status(400).json({
      status: '0',
      message: 'Invalid role provided',
    });
  }

  try { 
  
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: '0',
        message: 'User not found',
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      status: '1',
      message: 'User role updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Role update error:', err.message);
    res.status(500).json({
      status: '0',
      message: 'Server error',
    });
  }
};

const logout = async (req, res) => {
  try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (user) {
          await user.update({ refreshToken: null });
          res.status(200).json({ message: 'Logged out successfully!' });
      } else {
          res.status(404).json({ message: 'User not found!' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const protectedRoute = (req,res)=>{
  
  try{
    res.status(200).json({status:'ture',message:`Hello ${req.user.username} welcome in protected route`});
    
  }catch(error){
    console.log(error.message);
  }
}


module.exports = {
  signup,
  login,
  changePassword,
  forgotPassword,
  verifyPasswordOTP,
  changePasswordByOtp,
  updateRole,
  logout,
  protectedRoute
};

*/

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

