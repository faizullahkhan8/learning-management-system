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
import { authorizeRole, isAuthenticated } from "../middlewares/auth"; // Middleware for authorization and authentication

const router = express.Router();

/**
 * Route to register a new user.
 * Accessible to all users.
 */
router.post("/registration", UserRegistration);

/**
 * Route to activate a user account.
 * Accessible to all users, typically after registration.
 */
router.post("/registration/activate", activateUser);

/**
 * Route for user login.
 * Accessible to all users.
 */
router.post("/login", loginUser);

/**
 * Route to log out the authenticated user.
 * Requires the user to be authenticated.
 */
router.get("/logout", isAuthenticated, logoutUser);

/**
 * Route to refresh the access token.
 * Requires the user to be authenticated.
 */
router.get("/refresh/token", updateAccessToken);

/**
 * Route to get the authenticated user's profile information.
 * Accessible only to authenticated users.
 */
router.get("/me", isAuthenticated, getUserInfo);

/**
 * Route for social authentication (e.g., Google/Facebook).
 * Requires the user to be authenticated.
 */
router.post("/social/auth", isAuthenticated, socialAuth);

/**
 * Route to update user information (e.g., name, email).
 * Requires the user to be authenticated.
 */
router.put("/update/user/info", isAuthenticated, updateUser);

/**
 * Route to update the user's password.
 * Requires the user to be authenticated.
 */
router.put("/update/password", isAuthenticated, updateUserPassword);

/**
 * Route to update the user's profile picture.
 * Requires the user to be authenticated.
 */
router.put("/update/avatar", isAuthenticated, updateUserProfilePicture);

/**
 * Route to get all users for admin.
 * Accessible only to authenticated admin users.
 */
router.get(
    "/get-for-admin/all",
    isAuthenticated, // Ensure the user is authenticated
    authorizeRole("admin"), // Ensure the user has an admin role
    getAllUsers // Controller to fetch all users
);

/**
 * Route to update a user's role (e.g., from user to admin).
 * Accessible only to authenticated admin users.
 */
router.put(
    "/update-role",
    isAuthenticated, // Ensure the user is authenticated
    authorizeRole("admin"), // Ensure the user has an admin role
    updateUserRole // Controller to handle user role updates
);

/**
 * Route to delete a user by their ID.
 * Accessible only to authenticated admin users.
 */
router.delete(
    "/delete/:id",
    isAuthenticated, // Ensure the user is authenticated
    authorizeRole("admin"), // Ensure the user has an admin role
    deleteUser // Controller to delete the user
);

export default router;
