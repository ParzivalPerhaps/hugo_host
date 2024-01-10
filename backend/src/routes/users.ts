import express from "express";
import * as UserController from "../controllers/users";

const router = express.Router();

router.get("/", UserController.getAuthenticatedUser);
router.get("/userSettings", UserController.getUserStats);

router.post("/signup", UserController.signUp);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.post("/userSettings", UserController.setUserStat);

export default router;