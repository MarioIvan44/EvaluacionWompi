import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import customerModel from "../models/customers.js";
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

const registerCustomersController = {};

registerCustomersController.register = async (req, res) => {
  const { name, email, password, isVerified, loginAttempts, timeOut } =
    req.body;
  try {
    const existCustomer = await customerModel.findOne(email);
    if (existCustomer) {
      return res.status(400).json({ message: "customer already exist" });
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
        .json({ message: "Customer registered, verify your email" });
    });
    
  } catch (error) {
    console.error("error: " + error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

registerCustomersController.verifyCode = async (req, res) => {
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

    const newCustomer = new customerModel({
      name,
      email,
      password: passwordHash,
      isVerified: true,
      loginAttempts,
      timeOut,
    });

    await newCustomer.save();

    res.clearCookie("verificationToken");

    res.json({message: "Email verified succesfully"})
  } catch (error) {
    console.log("error: " + error)
    return res.status(500).json({message: "Internal server error"})
  }
};

export default registerCustomersController;
