// import { Response, Request, NextFunction } from "express";
// import { merge } from "lodash";

// import { getUserBySessionToken } from "../controllers/users.controller";

// export const isAuthenticated = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const sessionToken = req.cookies["USER-AUTH"];

//     if (!sessionToken) {
//       return res.status(403).json({ error: "Authentication required" });
//     }

//     const existingUser = await getUserBySessionToken(sessionToken);

//     if (!existingUser) {
//       return res.status(403).json({ error: "Authentication required" });
//     }

//     merge(req, { identity: existingUser });
//     console.log("user is authenticated");

//     return next();
//   } catch (err) {
//     console.error(err);
//     return res.status(400).send({ error: "Unable to get session token" });
//   }
// };
