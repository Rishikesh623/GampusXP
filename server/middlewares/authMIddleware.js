const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const authUser = (req, res, next) => {


  try {
    const cookieHeader = req.headers.cookie; // get cookie from the headers
    // console.log(cookieHeader);
    if (!cookieHeader) {
      return res.status(401).json({ message: 'No token, authorization denied', error: true });
    }

    // Split and find the token value from cookies
    const token = cookieHeader.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied', error: true });
    }


    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; //attach the decoded user id to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid', error: true });
  }
};

const authCoordinator = (req, res, next) => {
  if (req.session.isCoordinator) {
    return next();  // Proceed to the requested route
  } else {
    res.status(403).send({ message: 'Forbidden: You are not authorized.', error: true });
  }
};

module.exports = { authUser, authCoordinator };
