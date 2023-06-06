import mongoose, { Schema, Document } from "mongoose";

export interface IUser {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  dob: string;
  authentication: {
    password: string;
    salt: string;
    sessionToken: string;
  };
}

export interface IUserModel extends IUser, Document {}

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: String, required: true },
    authentication: {
      password: { type: String, required: true, selected: false },
      salt: { type: String, selected: false },
      sessionToken: { type: String, selected: false },
    },
  },
  { versionKey: false }
);

export default mongoose.model<IUserModel>("User", UserSchema);

export interface IUserDoc extends IUser {
  _id: mongoose.Types.ObjectId;
}
