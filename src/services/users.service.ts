import UserModel from "../models/user.model";
import { IUserDoc } from "../models/user.model";
import { Response } from "express";

export const createUserService = async (userDoc: IUserDoc, res: Response) => {
  const user = new UserModel(userDoc);
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
