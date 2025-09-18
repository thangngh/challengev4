import { NextFunction, Request, Response } from "express";
import jwtStrategy from "../strategies/jwt.strategy";
import userService from "DDD/user/service/user.service";

export const authUser = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization?.split(" ")[1];
    try {
      if (token) {
        const decoded = jwtStrategy.verifyAccessToken(token);
        // const user = await userService.getUserById(decoded)
        // req.user = user;
        next();
      }
    } catch (error) {
      res.status(401).send("Unauthorized");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
}

export const cookie = (req: Request, res: Response, next: NextFunction) => {
    
}