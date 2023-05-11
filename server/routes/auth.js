import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { login, verify } from "../controllers/auth.js";
import { createToken ,googleLogin, googleCallback, facebookLogin, facebookCallback, githubLogin, githubCallback } from "../services/sso.js";
const router = express.Router();

router.post("/login", login);
router.post("/verify", verifyToken ,verify);

router.get(`/google`, googleLogin);
router.get(`/google/callback`, googleCallback, createToken);

router.get(`/facebook`, facebookLogin);
router.get(`/facebook/callback`, facebookCallback);

router.get(`/github`, githubLogin);
router.get(`/github/callback`, githubCallback);



export default router;