// const jwt = require('jsonwebtoken');
// const config = require('../config/config');

// module.exports = function (req, res, next) {
//   const token = req.header('Authorization')?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({status:'0', message: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, config.jwtSecret);
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({status:'0', message: 'Token is not valid' });
//   }
// };


const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: '0', message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {

      return res.status(403).json({ status: '0', message: 'Access token expired, please refresh your token' });
    }

    return res.status(403).json({ status: '0', message: 'Invalid token' });
  }
};

const authenticateRefreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken || req.header('x-refresh-token');

  if (!refreshToken) {
    return res.status(401).json({ status: '0', message: 'No refresh token, authorization denied' });
  }

  try {

    const decoded = jwt.verify(refreshToken, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ status: '0', message: 'Refresh token expired, please log in again' });
    }
    return res.status(403).json({ status: '0', message: 'Invalid refresh token' });
  }
};

module.exports = {
  authenticateToken,
  authenticateRefreshToken,
};
