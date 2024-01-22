import express, { Router, Request, Response } from "express";
import mongoose from "mongoose";
import Sample from "../../models/Sample";
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
  const sample = new Sample({
    sample: req.body.sample,
    location: req.body.location
  });
  try {
    let sample_check = await Sample.findOne({
      sample: req.body.sample,
      location: req.body.location
    });
    if (sample_check) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Sample already exists" }] });
    }
    await sample.save();
    res.json(sample);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});
router.get("/all", auth, async (req: AuthRequest, res: Response) => {
    const samples = await Sample.find().sort("sample");
    res.json(samples);
  });
router.delete(
    "/delete/:sample_id",
    auth,
    async (req: AuthRequest, res: Response) => {
      let sample = await Sample.findOne({ _id: req.params.sample_id });
      if (!sample) {
        return res.status(404).json({ msg: "Sample not found." });
      }
      if (req.user.role !== "admin") {
        return res
          .status(400)
          .json({ msg: "You don't have permission to delete user" });
      }
      await Sample.deleteOne({ _id: req.params.sample_id });
      res.json({ msg: "Delete Successfully" });
    }
  );
  export default router;
