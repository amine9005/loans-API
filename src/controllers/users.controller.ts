import { Request, Response } from "express";
import userModel from "../models/user.model";
import { ObjectId } from "mongodb";

const getUserById = (req: Request, res: Response) => {
  const { id } = req.params;
  return userModel
    .findById(id)
    .then((user) => {
      console.log("User Found by id  successfully");
      res.status(200).json({ user });
    })
    .catch((err) => {
      console.error("Unable to find user: " + err.message);
      res.status(404).json({ error: err.message });
    });
};

const getUserByEmail = (req: Request, res: Response) => {
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
const updateUser = (req: Request, res: Response) => {
  //Update by id

  const { firstName, middleName, lastName, email, dob, password } = req.body;

  if (
    firstName == null ||
    middleName == null ||
    lastName == null ||
    email == null ||
    dob == null
  ) {
    console.log("User body: " + JSON.stringify(req.body));
    console.log("firstName: " + JSON.stringify(firstName));
    console.log("middleName: " + JSON.stringify(middleName));
    console.log("lastName: " + JSON.stringify(lastName));
    console.log("email: " + JSON.stringify(email));
    console.log("dob: " + JSON.stringify(dob));
    return res.status(400).json({ error: "all fields are required" });
  }

  userModel
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        email: email,
        dob: dob,
      }
    )
    .then(() => {
      console.log("Customer data updated");
      return res
        .status(200)
        .json({ message: "Customer data updated successfully " });
    })
    .catch((err) => {
      console.log("Unable to update Customer data " + err.message);
      return res
        .status(500)
        .json({ error: "Unable to update Customer data " + err.message });
    });
};
const deleteUser = (req: Request, res: Response) => {
  //by id findOneAndDelete(_id:id)
  res.status(501).json({});
};
export const getAllUsers = async (req: Request, res: Response) => {
  return userModel
    .find()
    .then((users) => {
      console.log("Users were found");
      return res.status(200).json({ users });
    })
    .catch((err) => {
      console.error("Unable to find users: " + err.message);
      return res.status(500).json({ error: err.message });
    });
};

export const getUserBySessionToken = (sessionToken: string) => {
  return userModel.findOne({ "authentication.sessionToken": sessionToken });
};

export default {
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  getAllUsers,
};
