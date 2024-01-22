import express, { Router, Request, Response } from "express";
import Owner from "../../models/Owner";
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
  const owner_dd = new Owner({
    owner: req.body.owner,
    location: req.body.location,
  });
  try {
    const { owner } = req.body;
    let owner_check = await Owner.findOne({ owner });
    if (owner_check) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Owner already exists" }] });
    }
    await owner_dd.save();
    res.json(owner_dd);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});
router.get("/all", auth, async (req: AuthRequest, res: Response) => {
  const owners = await Owner.find().sort("owner");
  res.json(owners);
});

router.delete(
  "/delete/:owner_id",
  auth,
  async (req: AuthRequest, res: Response) => {
    let owner = await Owner.findOne({ _id: req.params.owner_id });
    if (!owner) {
      return res.status(404).json({ msg: "Owner not found." });
    }
    if (req.user.role !== "admin") {
      return res
        .status(400)
        .json({ msg: "You don't have permission to delete user" });
    }
    await Owner.deleteOne({ _id: req.params.owner_id });
    res.json({ msg: "Delete Successfully" });
  }
);
export default router;
