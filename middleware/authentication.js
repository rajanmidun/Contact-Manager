const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token)
    res.status(401).json({ status: false, msg: 'No token, Authorization denied' });
  else {
    try {
      const decoded = jwt.verify(token, config.get('jwtSecret'));
      req.user = decoded;
      next();
    }
    catch (e) {
      res.status(401).json({ status: false, msg: 'Token not valid' });
    }
  }
}