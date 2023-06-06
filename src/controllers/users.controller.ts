import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import userModel from "../models/user.model";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName } = req.body;
  const { middleName } = req.body;
  const { lastName } = req.body;
  const { email } = req.body;
  const { dob } = req.body;
  const { password } = req.body;

  return userModel
    .findOne({ email: email })
    .then((tmp) => {
      if (tmp) {
        console.log("Email Already Exists");
        return res.status(409).json({ error: "Email Already Exists" });
      }
      const user = new userModel({
        _id: new mongoose.Types.ObjectId(),
        firstName,
        middleName,
        lastName,
        email,
        authentication: { password: password },
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

const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  return userModel
    .findOne({ _id: id })
    .then((user) => {
      console.log("User Found was by id  successfully");
      res.status(200).json({ user });
    })
    .catch((err) => {
      console.error("Unable to find user: " + err.message);
      res.status(404).json({ error: err.message });
    });
};

const getUserByEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.params;
  return userModel
    .findOne({ email })
    .then((user) => {
      if (user) {
        console.log("User Found successfully");
        return res.status(200).json({ user });
      }
      console.log("User Not Found ");

      return res.status(404).json({ error: "User Not Found " });
    })
    .catch((err) => {
      console.error("Unable to find user: " + err.message);
      return res.status(500).json({ error: err.message });
    });
};
const updateUser = (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({});
};
const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({});
};
const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({});
};

export default {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getAllUsers,
};
