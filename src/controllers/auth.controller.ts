import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import userModel from "../models/user.model";
import { random, authentication } from "../helpers";

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
      console.log("user object: " + user);
      const expectedHash = authentication(user.authentication.salt, password);

      if (expectedHash !== user.authentication.password) {
        return res.status(403).json({ error: "Wrong password" });
      }

      const salt = random();
      user.authentication.sessionToken = authentication(
        salt,
        user._id.toString()
      );

      user
        .save()
        .then((user) => {
          res.cookie("USER-AUTH", user.authentication.sessionToken, {
            domain: "localhost",
            path: "/",
          });
          console.log("Login successful");
          return res.status(200).json(user);
        })
        .catch((err) => {
          console.error("Unable To Save user Session");
          return res
            .status(500)
            .json({ error: "Unable to Save Session " + err.message });
        });
    })
    .catch((err) => {
      console.error("Error cant find user: " + err.message);
      return res
        .status(500)
        .json({ error: "Error cant find user: " + err.message });
    });
};

const refresh = (req: Request, res: Response) => {
  return res.status(501);
};

const logout = (req: Request, res: Response) => {
  return res.status(501);
};
export default { login, registerUser, refresh, logout };
