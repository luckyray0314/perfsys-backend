import express, { Router, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../../models/User";
import auth from "../../middleware/auth";

const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: string;
    status: string;
  };
}

router.get("/users", auth, async (req: AuthRequest, res: Response) => {
    const users = await User.find({"role" : "user"}, "email");
    if (users.length) {
      return res.json(users);
    } else if (!users.length) {
      res.status(204).json({ msg: "Not Found Any users!" });
    } else {
      res.status(400).json({ msg: "You have no permission" });
    }
  });

  export default router;