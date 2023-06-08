import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import userModel from "../models/user.model";
import {
  random,
  authentication,
  createAccessToken,
  createRefreshToken,
  userToken,
} from "../helpers";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName } = req.body;
  const { middleName } = req.body;
  const { lastName } = req.body;
  const { email } = req.body;
  const { dob } = req.body;
  const { password } = req.body;

  if (!firstName || !lastName || !email || !password || !dob) {
    return res.status(400).json({ error: "All required fields" });
  }

  return userModel
    .findOne({ email: email })
    .then((tmp) => {
      if (tmp) {
        console.log("Email Already Exists");
        return res.status(409).json({ error: "Email Already Exists" });
      }
      const salt = random();
      const user = new userModel({
        _id: new mongoose.Types.ObjectId(),
        firstName,
        middleName,
        lastName,
        email,
        authentication: { salt, password: authentication(salt, password) },
        dob,
      });
      user
        .save()
        .then(() => {
          console.log("User created successfully");
          return res.status(200).json({ user });
        })
        .catch((err) => {
          console.error("Unable to create user: " + err.message);
          return res.status(406).json({ error: err.message });
        });
    })
    .catch((err) => {
      console.error("Unable to find user: " + err.message);
      return res.status(500).json({ error: err.message });
    });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Invalid email or password" });
  }

  userModel
    .findOne({ email })
    .select("+authentication.salt +authentication.password")
    .then((user) => {
      const expectedHash = authentication(user.authentication.salt, password);

      if (expectedHash !== user.authentication.password) {
        return res.status(403).json({ error: "Wrong password" });
      }

      // const salt = random();
      // user.authentication.sessionToken = authentication(
      //   salt,
      //   user._id.toString()
      // );

      const userPayload = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        // "role":user.role
      };
      const accessToken = createAccessToken(userPayload, "5min");

      const refreshToken = createRefreshToken(userPayload, "7d");

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        // secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ accessToken });
    })
    .catch((err) => {
      console.error("Error cant find user: " + err.message);
      return res
        .status(500)
        .json({ error: "Error cant find user: " + err.message });
    });
};

const refresh = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ error: "Please Login First!" });
  }
  const refreshToken = cookies.jwt;
  try {
    const current = jwt.verify(
      refreshToken,
      config.secret.refresh
    ) as userToken;
    return userModel
      .findById(current["userinfo"]["user_id"])
      .then((user) => {
        const userPayload = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          // "role":user.role
        };
        const accessToken = createAccessToken(userPayload, "15min");
        return res.status(200).json({ accessToken });
      })
      .catch((err) => {
        return res
          .status(401)
          .json({ error: "Unauthorized User Was Not Found: " + err.message });
      });
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: " + err.message });
  }
};

const logout = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ error: "Cookie Does Not Exist!" });
  }
  res.cookie("jwt", "", {
    maxAge: 0,
    httpOnly: true,
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

export default { login, registerUser, refresh, logout };
