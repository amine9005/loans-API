import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import UserModel from "../models/user.model";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName } = req.body;
  const { middleName } = req.body;
  const { lastName } = req.body;
  const { email } = req.body;
  const { dob } = req.body;
  const { password } = req.body.authentication;

  const user = new UserModel({
    _id: new mongoose.Types.ObjectId(),
    firstName,
    middleName,
    lastName,
    email,
    authentication: { password: password },
    dob,
  });

  return user
    .save()
    .then(() => {
      console.log("User created successfully");
      return res.status(200).json({ user: user });
    })
    .catch((err) => {
      console.error("Unable to create user: " + err.message);
      return res.status(406).json({ error: err.message });
    });
};

const readUser = (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({});
};
const updateUser = (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({});
};
const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({});
};
const readAllUser = (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({});
};

export default { createUser, readUser, updateUser, deleteUser, readAllUser };
