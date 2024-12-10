import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json('Access Denied');
  }

  try {
    // Verify the token using the secret key from the environment variables
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;  // Attach the verified user data to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json('Invalid Token');
  }
};
