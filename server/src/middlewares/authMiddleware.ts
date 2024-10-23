import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.token; // Assuming token is stored in cookies
  if (!token) {
        res.status(403).json({ message: 'No token, authorization denied' });
        return
    }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded; // Attach decoded token data (user) to the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};


