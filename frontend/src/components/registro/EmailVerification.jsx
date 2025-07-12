registerCustomersController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;
  const token = req.cookies.verificationToken;

  if (!token) {
    return res.status(400).json({ message: "Please register first." });
  }

  try {
    const decoded = jsonwebtoken.verify(token, config.JWT.JWT_SECRET);
    const { email, verificationCode: storedCode, expiresAt } = decoded;

    if (Date.now() > expiresAt) {
      return res.status(401).json({ message: "Verification code expired." });
    }

    if (verificationCode !== storedCode) {
      return res.status(401).json({ message: "Invalid verification code." });
    }

    const client = await clientsModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { isVerified: true } },
      { new: true }
    );

    console.log("CLIENT UPDATED:", client);

    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }

    res.clearCookie("verificationToken");

    await sendMail(
      client.email,
      "Welcome!",
      `Hi ${client.firstName}, welcome!`,
      HTMLWelcomeEmail(client.firstName)
    );

    res.json({ message: "Email verified successfully.", client });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ message: "Token verification failed." });
  }
};
