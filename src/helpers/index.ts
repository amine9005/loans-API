import { config } from "../config/config";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(config.secret.update)
    .digest("hex");
};

export interface userPayLoad {
  _id: string;
  firstName: string;
  lastName: string;
  // "role":user.role
}
export interface userToken {
  userinfo: {
    user_id: string;
    username: string;
    // "role":user.role
  };
  iat: number;
  exp: number;
}

export function createAccessToken(user: userPayLoad, exp: string) {
  return jwt.sign(
    {
      userinfo: {
        user_id: user._id,
        username: user.firstName + " " + user.lastName,
        // "role":user.role
      },
    },
    config.secret.access,
    { expiresIn: exp }
  );
}

export function createRefreshToken(user: userPayLoad, exp: string) {
  return jwt.sign(
    {
      userinfo: {
        user_id: user._id,
        username: user.firstName + " " + user.lastName,
        // "role":user.role
      },
    },
    config.secret.refresh,
    { expiresIn: exp }
  );
}
