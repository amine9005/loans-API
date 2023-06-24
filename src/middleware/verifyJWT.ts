import jwt_lib from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { userToken } from "../helpers";
import { config } from "../config/config";
// import { extend } from "lodash";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const { jwt } = req.cookies;

  if (!authHeader?.startsWith("Bearer ") || !jwt) {
    console.log("Auth header is Required");
    return res
      .status(401)
      .json({ error: "Auth header is Required, please login" });
  }
  const token = authHeader.split(" ")[1];
  try {
    jwt_lib.verify(token, config.secret.access) as userToken;
    // extend(req, { identity: currentUser["userinfo"] });
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: "Unable to verify please Login: " + err.message });
  }
};

export default verifyJWT;
