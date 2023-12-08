import express, { Router, Request, Response } from "express";
import mongoose from "mongoose";
import Customer from "../../models/Customer";
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
    const customer_dd =  new Customer({
        customer: req.body.customer,
        location: req.body.location
    });
    try {
      await customer_dd.save();
        res.json(customer_dd);
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
    const customers = await Customer.find().sort("customer");
    res.json(customers);
  });
router.delete(
    "/delete/:customer_id",
    auth,
    async (req: AuthRequest, res: Response) => {
      let customer = await Customer.findOne({ _id: req.params.customer_id });
      if (!customer) {
        return res.status(404).json({ msg: "User not found." });
      }
      if (req.user.role !== "admin") {
        return res
          .status(400)
          .json({ msg: "You don't have permission to delete user" });
      }
      await Customer.deleteOne({ _id: req.params.customer_id });
      res.json({ msg: "Delete Successfully" });
    }
  );
export default router