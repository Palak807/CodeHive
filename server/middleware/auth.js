import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../config/index.js'

/** verfiy token or session  */
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

   if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

