import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import adminModel from "../models/admins.js";
import { config } from "../../config.js";

/**
 * fields
 * name
● email
● password
● isVerified
● loginAttempts
● timeOut
 */

const registerAdminsController = {};

registerAdminsController.register = async (req, res) => {
  const { name, email, password, isVerified, loginAttempts, timeOut } =
    req.body;
  try {
    const existAdmin = await adminModel.findOne(email);
    if (existAdmin) {
      return res.status(400).json({ message: "admin already exist" });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const verificationCode = crypto.randomBytes(3).toString("hex");

    const tokenCode = jwt.sign(
      {
        name,
        email,
        password: passwordHash,
        verificationCode,
        isVerified,
        loginAttempts,
        timeOut,
      },
      config.JWT.secret,
      { expiresIn: "15m" },
    );

    res.cookie("verificationToken", tokenCode, { maxAge: 15 * 60 * 1000 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "verificación de cuenta",
      text:
        "Para verificar tu cuenta utiliza este código: " +
        verificationCode +
        " expira en 15 minutos",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "error" });
      }
      return res
        .status(200)
        .json({ message: "Admin registered, verify your email" });
    });
  } catch (error) {
    console.error("error: " + error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

registerAdminsController.verifyCode = async (req, res) => {
  try {
    const { verificationCodeRequest } = req.body;

    const token = req.cookies.verificationToken;

    console.log(token);

    const decoded = jwt.verify(token, config.JWT.secret);
    const {
      name,
      email,
      password: passwordHash,
      verificationCode: storedCode,
      isVerified,
      loginAttempts,
      timeOut,
    } = decoded;

    if (verificationCodeRequest !== storedCode) {
      return res.status(400).json({ meessage: "invalid code" });
    }

    const newAdmin = new adminModel({
      name,
      email,
      password: passwordHash,
      isVerified: true,
      loginAttempts,
      timeOut,
    });

    await newAdmin.save();

    res.clearCookie("verificationToken");

    res.json({message: "Email verified succesfully"})
  } catch (error) {
    console.log("error: " + error)
    return res.status(500).json({message: "Internal server error"})
  }
};

export default registerAdminsController;
