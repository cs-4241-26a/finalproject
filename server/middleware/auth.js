import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/response.js';

export const activeTokens = new Set();

export const requireAuth = (req, res, next) => {

  const token = req.cookies?.sessionToken;

  if (!token) {
    return sendResponse(res, 401, {}, "Authentication token missing or invalid", false);
  }

  if (!activeTokens.has(token)) {

    return sendResponse(res, 401, {}, "Session invalidated or logged out", false);
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } 
  catch (err) {
    
    activeTokens.delete(token);
    res.clearCookie('sessionToken');
    return sendResponse(res, 401, {}, "Session expired or invalid token", false);
  }
};