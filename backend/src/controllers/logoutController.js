// backend/src/controllers/logoutController.js

/**
 * logoutClient: Clears the JWT cookie, effectively logging out the user.
 * Route: POST /api/logout
 * Access: Private (must provide a valid token)
 */
export const logoutClient = async (req, res) => {
  try {
    // Clear the cookie named 'tokenEternalJoyeria'
    res.clearCookie("tokenEternalJoyeria");
    return res.status(200).json({ message: "Logout successful." });
  } catch (err) {
    console.error("❌ Error in logoutClient:", err);
    return res.status(500).json({ message: "Server error during logout." });
  }
};
