import express from "express";
import {
    activateUser,
    deleteUser,
    getAllUsers,
    getUserInfo,
    loginUser,
    logoutUser,
    socialAuth,
    updateAccessToken,
    updateUser,
    updateUserPassword,
    updateUserProfilePicture,
    updateUserRole,
    UserRegistration,
} from "../controllers/user.controller";
import { authorizeRole, isAuthenticated } from "../middlewares/auth"; // -> to authoriz the role with authorizeRole function

const router = express.Router();

// NOTE => here all routes will have additional endPoint " user " because it is spcified in app.ts file

router.post("/registration", UserRegistration);
router.post("/registration/activate", activateUser);
router.post("/login", loginUser);
router.get("/logout", isAuthenticated, logoutUser);
router.get("/refresh/token", updateAccessToken);
router.get("/me", isAuthenticated, getUserInfo);
router.post("/social/auth", isAuthenticated, socialAuth);
router.put("/update/user/info", isAuthenticated, updateUser);
router.put("/update/password", isAuthenticated, updateUserPassword);
router.put("/update/avatar", isAuthenticated, updateUserProfilePicture);

router.get(
    "/get-for-admin/all",
    isAuthenticated,
    authorizeRole("admin"),
    getAllUsers
);

router.put(
    "/update-role",
    isAuthenticated,
    authorizeRole("admin"),
    updateUserRole
);

router.delete(
    "/delete/:id",
    isAuthenticated,
    authorizeRole("admin"),
    deleteUser
);

export default router;
