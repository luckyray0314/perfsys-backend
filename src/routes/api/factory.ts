import express, { Router, Request, Response } from "express";
import mongoose from "mongoose";
import Factory from "../../models/Factory";
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

router.post("/add", auth, async (req: AuthRequest, res: Response) => {
    const factory_dd =  new Factory({
        factory: req.body.factory,
        location: req.body.location,
        employee: req.body.employee,
    });
    try {
      await factory_dd.save();
        res.json(factory_dd);
    }
    catch(error) {
        res.status(400).json({ msg: error });
    }
})
router.get("/all", auth, async (req: AuthRequest, res: Response) => {
    if (req.user.role !== "admin") {
      return res
        .status(400)
        .json({ msg: "You don't have permission to get data" });
    }
    const factories = await Factory.find().sort("factory");
    res.json(factories);
  });
router.delete(
    "/delete/:factory_id",
    auth,
    async (req: AuthRequest, res: Response) => {
      let factory = await Factory.findOne({ _id: req.params.factory_id });
      if (!factory) {
        return res.status(404).json({ msg: "User not found." });
      }
      if (req.user.role !== "admin") {
        return res
          .status(400)
          .json({ msg: "You don't have permission to delete user" });
      }
      await Factory.deleteOne({ _id: req.params.factory_id });
      res.json({ msg: "Delete Successfully" });
    }
  );
export default router