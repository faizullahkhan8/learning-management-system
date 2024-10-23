import express from "express";
import {
    activateUser,
    getUserInfo,
    loginUser,
    logoutUser,
    socialAuth,
    updateAccessToken,
    updateUser,
    updateUserPassword,
    updateUserProfilePicture,
    UserRegistration,
} from "../controllers/user.controller";
import { authorizeRole, isAuthenticated } from "../middlewares/auth"; // -> to authoriz the role with authorizeRole function

const router = express.Router();

// NOTE => here all routes will have additional endPoint " user " because it is spcified in app.ts file

router.post("/registeration", UserRegistration);
router.post("/registeration/activate", activateUser);
router.post("/login", loginUser);
router.get("/logout", isAuthenticated, logoutUser);
router.get("/refresh/token", updateAccessToken);
router.get("/me", isAuthenticated, getUserInfo);
router.post("/social/auth", isAuthenticated, socialAuth);
router.put("/update/user/info", isAuthenticated, updateUser);
router.put("/update/password", isAuthenticated, updateUserPassword);
router.put("/update/avatar", isAuthenticated, updateUserProfilePicture);

export default router;
