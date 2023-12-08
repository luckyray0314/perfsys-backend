import express, { Router, Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../../models/Order";
import OrderHistory from "../../models/OrderHistory";
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

router.post("/create", auth, async (req: AuthRequest, res: Response) => {
  console.log(req.user._id);

  const order = new Order({
    userId: new mongoose.Types.ObjectId(req.user._id),
    orderPO: req.body.orderPO,
    factory: req.body.factory,
    customer: req.body.customer,
    owner: req.body.owner,
    completionDate: req.body.completionDate,
    readyDate: req.body.readyDate,
    qScore: req.body.qScore,
    cScore: req.body.cScore,
    pScore: req.body.pScore 
  });
  try {
    const savedOrder = await order.save();
    const orderHistory = new OrderHistory({
      orderId: new mongoose.Types.ObjectId(String(savedOrder._id)),
      userId: new mongoose.Types.ObjectId(req.user._id),
      orderPO: req.body.orderPO,
      factory: req.body.factory,
      customer: req.body.customer,
      owner: req.body.owner,
      completionDate: req.body.completionDate,
      readyDate: req.body.readyDate,
    });
    await orderHistory.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});
router.post("/addhistory/:orderId", auth, async (req: AuthRequest, res: Response) => {
  console.log(req.user._id);

  const orderHistory = new OrderHistory({
    userId: new mongoose.Types.ObjectId(req.user._id),
    orderId: req.params.orderId,
    orderPO: req.body.orderPO,
    factory: req.body.factory,
    customer: req.body.customer,
    owner: req.body.owner,
    completionDate: req.body.completionDate,
    readyDate: req.body.readyDate,
  });
  try {
    await orderHistory.save();
    res.json(orderHistory);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});
router.get("/:userid", auth, async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({
    userId: req.params.userid,
  });
  if (orders.length) {
    return res.json(orders);
  } else if (!orders.length) {
    res.status(204).json({ msg: "Not Found Any Orders!" });
  } else {
    res.status(400).json({ msg: "You have no permission" });
  }
});
router.get("/getScoreCustomer/:customer", auth, async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({customer: req.params.customer });
  if (orders.length) {
    return res.json(orders);
  } else if (!orders.length) {
    res.status(204).json({ msg: "Not Found Any Orders!" });
  } else {
    res.status(400).json({ msg: "You have no permission" });
  }
});
router.get("/getScoreFactory/:factory", auth, async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({factory: req.params.factory });
  if (orders.length) {
    return res.json(orders);
  } else if (!orders.length) {
    res.status(204).json({ msg: "Not Found Any Orders!" });
  } else {
    res.status(400).json({ msg: "You have no permission" });
  }
});
router.get("/getScoreOwner/:owner", auth, async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({owner: req.params.owner });
  if (orders.length) {
    return res.json(orders);
  } else if (!orders.length) {
    res.status(204).json({ msg: "Not Found Any Orders!" });
  } else {
    res.status(400).json({ msg: "You have no permission" });
  }
});

router.get(
  "/history/:orderid",
  auth,
  async (req: AuthRequest, res: Response) => {
    const orders = await OrderHistory.find({
      orderId: req.params.orderid,
    });
    console.log("backend history", req.params.orderid);
    if (orders.length) {
      return res.json(orders);
    } else if (!orders.length) {
      res.status(204).json({ msg: "Not Found Any Orders!" });
    } else {
      res.status(400).json({ msg: "You have no permission" });
    }
  }
);

router.put("/:orderId", auth, async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.orderId);
  const updateOrder = {
    _id: req.params.orderId,
    orderPO: order.orderPO,
    factory: req.body.factory,
    customer: req.body.customer,
    owner: req.body.owner,
    completionDate: req.body.completionDate,
    readyDate: req.body.readyDate,
  };
  if (order) {
    await Order.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.orderId) },
      updateOrder
    );
    return res.json(updateOrder);
  } else {
    return res.json({ msg: "Not found!" });
  }
});
router.put("/complete/:orderId/:userId", auth, async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.orderId);
  const completeOrder = {
    _id: req.params.orderId,
    qScore: req.body.qScore,
    cScore: req.body.cScore,
    pScore: req.body.pScore
  };
  if (order) {
    await Order.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.orderId) },
      completeOrder
    );
    const updatedOrders = await Order.find({userId: req.params.userId})
    return res.json(updatedOrders);
  } else {
    return res.json({ msg: "Not found!" });
  }
});
router.delete("/:orderId", auth, async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.orderId);
  console.log(req.params.orderId);

  if (!order) {
    console.log("not found!");
    return res.status(404).json({ msg: "Order not found!" });
  }
  await Order.deleteOne({ _id: req.params.orderId });
  await res.json({ msg: "Order has been deleted successfully!" });
});

export default router;
