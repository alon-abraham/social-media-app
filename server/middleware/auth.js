import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json('Access Denied');
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;  // Attach the user data to the request object
    next();  // Pass the control to the next middleware or route handler
  } catch (err) {
    res.status(400).json('Invalid Token');
  }
};
