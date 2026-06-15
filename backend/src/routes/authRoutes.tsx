import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/Users.js";
import redis from "../config/redis.js";
import nodemailer from "nodemailer";

const router = express.Router();

const sendResetPassword = async (email: string, resetToken: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Nexus Core Security" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your Account",
    // 💡 CRUCIAL FIX: Adding a clean textual fallback calms spam filters down!
    text: `Your NexusCore verification security code string is: ${resetToken}. This token expires in 10 minutes.`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; padding: 20px; background-color: #040809; color: #ffffff; border-radius: 12px;">
        <h2 style="color: #1DE4EC; font-size: 24px;">Password Reset Request</h2>
        <p style="color: #9ca3af; font-size: 14px;">We received a request to change your account access password. Click the action option below to initialize a replacement configuration:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #1DE4EC; color: #030708; padding: 12px 24px; font-weight: bold; font-size: 14px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #6b7280; font-size: 11px;">This link expires in 1 hour. If you did not initialize this event, you can safely disregard this message.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendOtpEmail = async (email: string, otpCode: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Nexus Core Security" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your Account",
    text: `Your NexusCore verification security code string is: ${otpCode}. This token expires in 10 minutes.`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; padding: 20px; background-color: #040809; color: #ffffff; border-radius: 12px;">
        <h2 style="color: #1DE4EC; font-size: 24px;">Account Verification</h2>
        <p style="color: #9ca3af; font-size: 14px;">Enter the 6-digit confirmation pattern down below to activate your account profile.</p>
        <div style="background-color: #0a0f11; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0; border: 1px solid rgba(255,255,255,0.06);">
          <span style="font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 6px;">${otpCode}</span>
        </div>
        <p style="color: #6b7280; font-size: 11px;">This code expires in 10 minutes. If you did not request this verification string, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, companyName, password } = req.body;

    if (!firstName || !lastName || !email || !companyName || !password) {
      return res
        .status(400)
        .json({ error: "All registration fields are required!" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      companyName,
      password: hashedPassword,
      isVerified: false,
    });

    // ─── GENERATE 6-DIGIT OTP STRING ───
    // Using crypto.randomInt guarantees high entropy cryptographically secure integers
    const otpCode = crypto.randomInt(100000, 999999).toString();

    // ─── CACHE OTP TO REDIS WITH 10 MINUTE TTL ───
    // Key template structure: otp:email_address -> Expires in 600 seconds
    await redis.set(`otp:${email}`, otpCode, "EX", 600);

    // ─── TRIGGER DISPATCH CALL OVER SMTP ───
    await sendOtpEmail(email, otpCode);

    return res.status(201).json({
      success: true,
      message: "User staged successfully! Verification OTP sent to email.",
      userId: newUser._id,
      email: newUser.email,
    });
  } catch (error: any) {
    console.error("Registration error:", error.message);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please enter email and password!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password!" });
    }

    // ─── NEW: CHECK VERIFICATION STATUS ───
    if (!user.isVerified) {
      // Generate a fresh OTP code for them
      const otpCode = crypto.randomInt(100000, 999999).toString();

      // Save to Redis (10 min expiry) and fire the mailer
      await redis.set(`otp:${email}`, otpCode, "EX", 600);
      await sendOtpEmail(email, otpCode);

      // Return a 203 (Non-Authoritative) status code or explicit flag
      // so your Next.js app knows to route them to /verify
      return res.status(203).json({
        success: false,
        requiresVerification: true,
        message:
          "Account not verified. A new code has been sent to your email.",
        email: user.email,
      });
    }

    // ─── USER IS VERIFIED $\rightarrow$ PROCEED WITH SESSION GENERATION ───
    const sessionToken = crypto.randomUUID();
    await redis.set(
      `session:${sessionToken}`,
      JSON.stringify({ id: user._id, email: user.email }),
      "EX",
      86400,
    );

    res.cookie("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Authenticated successfully!",
      user: { id: user._id.toString(), email: user.email },
    });
  } catch (error: any) {
    console.error("Login error", error.message);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required!" });
    }

    const cachedOtp = await redis.get(`otp:${email}`);
    if (!cachedOtp) {
      return res
        .status(400)
        .json({ error: "Verification code expired or not found." });
    }

    if (cachedOtp !== code) {
      return res.status(400).json({ error: "Invalid verification code!" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    await redis.del(`otp:${email}`);
    const sessionToken = crypto.randomUUID();
    await redis.set(
      `session:${sessionToken}`,
      JSON.stringify({ id: user._id, email: user.email }),
      "EX",
      86400,
    );
    res.cookie("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      user: { id: user._id, email: user.email },
    });
  } catch (error: any) {
    console.error("Verification processing error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/forget-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ error: "Please enter your email address!" });
    }

    const user = await User.findOne({ email });
    // Security Best Practice: Don't explicitly reveal if an email doesn't exist to prevent enumeration attacks.
    // Instead, return a generic success message even if the target user profile wasn't found.
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If that email matches our records, a secure link has been dispatched.",
      });
    }

    // Generate a secure high-entropy random string as our unique token mapping key
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Cache the reset token mapping back to the user's email address inside Redis (Expires in 1 hour / 3600 seconds)
    await redis.set(`reset:${resetToken}`, user.email, "EX", 3600);

    // Ship mail to user inbox
    await sendResetPassword(user.email, resetToken);

    return res.status(200).json({
      success: true,
      message:
        "If that email matches our records, a secure link has been dispatched.",
    });
  } catch (error: any) {
    console.error("Forgot password processing error:", error.message);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        error: "Token reference and new password payload are required!",
      });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    // 1. Look up the token key value inside Redis
    const targetEmail = await redis.get(`reset:${token}`);

    if (!targetEmail) {
      return res.status(400).json({
        error:
          "The authorization window has closed or your link token is invalid.",
      });
    }

    // 2. Hash the replacement credentials
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // 3. Locate user and write replacement credentials array map
    const updatedUser = await User.findOneAndUpdate(
      { email: targetEmail },
      { password: hashedNewPassword },
      { new: true },
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ error: "User configuration reference not found." });
    }

    // 4. Burn the consumed token in Redis immediately to block re-execution exploits
    await redis.del(`reset:${token}`);

    // 5. Security Step: Purge any current active sessions for this user so they must log back in everywhere
    // (Optional but highly recommended for password alterations)

    return res.status(200).json({
      success: true,
      message:
        "Password updated successfully! You can now log in using your new credentials.",
    });
  } catch (error: any) {
    console.error("Reset password execution breakdown:", error.message);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("session_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully!" });
});

export default router;
