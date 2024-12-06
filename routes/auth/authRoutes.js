
// const express = require('express');
// const authController = require('../../controllers/userController.js');
// //const commonController = require('../../controllers/commonController.js')
// const authMiddleware = require('../../middleware/authMiddleware.js');
// const router = express.Router();

// const {
//     signup,
//     login,
//     changePassword,
//     protectedRoute,
//     forgotPassword,
//     verifyPasswordOTP,
//     changePasswordByOtp,

// } = require('../../controllers/userController.js');


// router.post('/signup', signup);
// router.post('/login', login);
// router.put('/change-password', authMiddleware, changePassword);
// router.post('/forgot-password', forgotPassword);
// router.post('/verify-password-otp',verifyPasswordOTP);
// router.post('/change-password-by-otp',changePasswordByOtp);
// router.get('/protected', authMiddleware, protectedRoute);

// // Protected route example
// //router.get('/protected', authMiddleware, authController.protectedRoute);

// module.exports = router;

/*
const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware.js');
const {
  signup,
  login,
  changePassword,
  forgotPassword,
  verifyPasswordOTP,
  changePasswordByOtp,
  updateRole,
  logout,
  protectedRoute,
} = require('../../controllers/userController.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.put('/change-password', authMiddleware, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/verify-password-otp', verifyPasswordOTP);
router.post('/change-password-by-otp', changePasswordByOtp);
router.put('/update-role', authMiddleware, updateRole);
router.post('/logout', authMiddleware, logout);


// Protected route
router.get('/protected', authMiddleware, protectedRoute);

module.exports = router;
*/

const express = require('express');
const {
  authenticateToken,
  authenticateRefreshToken,
} = require('../../middleware/authMiddleware.js');
const {
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
} = require('../../controllers/userController.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.post('/refresh-token', authenticateRefreshToken, (req, res) => {
  const jwt = require('jsonwebtoken');
  const { jwtSecret } = require('../../config/config');

  const user = req.user;
  const newAccessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, {
    expiresIn: '15m',
  });

  res.status(200).json({
    status: '1',
    message: 'Access token refreshed successfully',
    accessToken: newAccessToken,
  });
});


router.put('/change-password', authenticateToken, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/verify-password-otp', verifyPasswordOTP);
router.post('/change-password-by-otp', changePasswordByOtp);

router.put('/update-role', authenticateToken, updateRole);

router.get('/protected', authenticateToken, protectedRoute);

router.put('/edit-user', authenticateToken, editUser);
router.delete('/delete-user', authenticateToken, deleteUser); 
router.post('/register-user', authenticateToken, registerUserByAdmin); 

module.exports = router;



