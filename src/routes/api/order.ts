import express, { Router, Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../../models/Order";
import OrderHistory from "../../models/OrderHistory";
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
    pScore: req.body.pScore,
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
//-------------------------------------get orders by two index------------------------//
router.post(
  "/getFactoryOrdersByPeriod",
  auth,
  async (req: AuthRequest, res: Response ) => {
    try{
      const order = await Order.find({customer: req.body.customer , owner: req.body.owner, readyDate: {$gte: req.body.fromDate, $lt: req.body.toDate}})
      return res.json(order);
    }catch (err) {
      return res.status(400).json({ msg: "Input error" });
    }
  }
);
router.post(
  "/getCustomerOrdersByPeriod",
  auth,
  async (req: AuthRequest, res: Response ) => {
    try{
      const order = await Order.find({factory: req.body.factory , owner: req.body.owner, readyDate: {$gte: req.body.fromDate, $lt: req.body.toDate}})
      return res.json(order);
    }catch (err) {
      return res.status(400).json({ msg: "Input error" });
    }
  }
);
router.post(
  "/getOwnerOrdersByPeriod",
  auth,
  async (req: AuthRequest, res: Response ) => {
    try{
      const order = await Order.find({factory: req.body.factory , customer: req.body.customer, readyDate: {$gte: req.body.fromDate, $lt: req.body.toDate}})
      return res.json(order);
    }catch (err) {
      return res.status(400).json({ msg: "Input error" });
    }
  }
);
//--------------------------------get orders by one index--------------------------------//

router.post(
  "/getOrdersBySample",
  auth,
  async (req: AuthRequest, res: Response) => {
    try {
      const order = await Order.find({ orderPO: req.body.sample, readyDate: {$gte: req.body.fromDate, $lt: req.body.toDate}});
      return res.json(order);
    } catch (error) {
      return res.status(400).json({ msg: "Input error" });
    }
  }
  );
router.post(
  "/getOrdersByFactory",
  auth,
  async (req: AuthRequest, res: Response) => {
    try {
      const order = await Order.find({ factory: req.body.factory, readyDate: {$gte: req.body.fromDate, $lt: req.body.toDate}});
      return res.json(order);
    } catch (error) {
      return res.status(400).json({ msg: "Input error" });
    }
  }
  );
router.post(
  "/getOrdersByCustomer",
  auth,
  async (req: AuthRequest, res: Response) => {
    try {
      const order = await Order.find({ customer: req.body.customer, readyDate: {$gte: req.body.fromDate, $lt: req.body.toDate}});
      return res.json(order);
    } catch (error) {
      return res.status(400).json({ msg: "Input error" });
    }
  }
  );
router.post(
  "/getOrdersByOwner",
  auth,
  async (req: AuthRequest, res: Response) => {
    try {
      const order = await Order.find({ owner: req.body.owner, readyDate: {$gte: req.body.fromDate, $lt: req.body.toDate}});
      return res.json(order);
    } catch (error) {
      return res.status(400).json({ msg: "Input error" });
    }
  }
  );

router.get(
  "/getFactoryByCustomer/:customer",
  auth,
  async (req: AuthRequest, res: Response) => {
    try {
      const order = await Order.find({ customer: req.params.customer });
      if (order.length) {
        const filterorders = await Order.aggregate([
          {
            $match: {
              customer: { $eq: req.params.customer },
            },
          },
          {
            $group: {
              _id: { factory: "$factory" },
              count: { $sum: 1 },
            },
          },
        ]);
        console.log(filterorders);
        if (filterorders.length) {
          return res.json(filterorders);
        } else if (!filterorders.length) {
          res.status(204).json({ msg: "Not Found Any Orders!" });
        } else {
          res.status(400).json({ msg: "You have no permission" });
        }
        res.json(filterorders);
      }
    } catch (error) {
      res.status(500).send({ msg: "An error currupted." });
    }
  }
);
router.get(
  "/getFactoryByOwner/:owner",
  auth,
  async (req: AuthRequest, res: Response) => {
    try {
      const order = await Order.find({ owner: req.params.owner });
      if (order.length) {
        const filterorders = await Order.aggregate([
          {
            $match: {
              owner: { $eq: req.params.owner },
            },
          },
          {
            $group: {
              _id: { factory: "$factory" },
              count: { $sum: 1 },
            },
          },
        ]);
        console.log(filterorders);
        if (filterorders.length) {
          return res.json(filterorders);
        } else if (!filterorders.length) {
          res.status(204).json({ msg: "Not Found Any Orders!" });
        } else {
          res.status(400).json({ msg: "You have no permission" });
        }
        res.json(filterorders);
      }
    } catch (error) {
      res.status(500).send({ msg: "An error currupted." });
    }
  }
);
router.put(
  "/complete/:orderId/:userId",
  auth,
  async (req: AuthRequest, res: Response) => {
    const order = await Order.findById(req.params.orderId);
    console.log("score length", order.qScore.length);
    const completeOrder = {
      _id: req.params.orderId,
      qScore: req.body.qScore,
      cScore: req.body.cScore,
      pScore: req.body.pScore,
    };
      await Order.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.orderId) },
        completeOrder
      );
      const updatedOrders = await Order.find({ userId: req.params.userId });
      return res.json(updatedOrders);
  }
);
router.post(
  "/addhistory/:orderId",
  auth,
  async (req: AuthRequest, res: Response) => {
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
  }
);
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
router.get(
  "/getScoreCustomer/:customer",
  auth,
  async (req: AuthRequest, res: Response) => {
    const orders = await Order.find({ customer: req.params.customer });
    if (orders.length) {
      return res.json(orders);
    } else if (!orders.length) {
      res.status(204).json({ msg: "Not Found Any Orders!" });
    } else {
      res.status(400).json({ msg: "You have no permission" });
    }
  }
);
router.get(
  "/getScoreCustomerSample/:customer",
  auth,
  async (req: AuthRequest, res: Response) => {
    const orders = await Order.find({ customer: req.params.customer, orderPO: 'sample' });
    if (orders.length) {
      return res.json(orders);
    } else if (!orders.length) {
      res.status(204).json({ msg: "Not Found Any Orders!" });
    } else {
      res.status(400).json({ msg: "You have no permission" });
    }
  }
);
router.get(
  "/getScoreFactory/:factory",
  auth,
  async (req: AuthRequest, res: Response) => {
    const orders = await Order.find({ factory: req.params.factory });
    if (orders.length) {
      return res.json(orders);
    } else if (!orders.length) {
      res.status(204).json({ msg: "Not Found Any Orders!" });
    } else {
      res.status(400).json({ msg: "You have no permission" });
    }
  }
);
router.get(
  "/getScoreFactorySample/:factory",
  auth,
  async (req: AuthRequest, res: Response) => {
    const orders = await Order.find({ factory: req.params.factory, orderPO: "sample" });
    if (orders.length) {
      return res.json(orders);
    } else if (!orders.length) {
      res.status(204).json({ msg: "Not Found Any Orders!" });
    } else {
      res.status(400).json({ msg: "You have no permission" });
    }
  }
);
router.get(
  "/getScoreOwner/:owner",
  auth,
  async (req: AuthRequest, res: Response) => {
    const orders = await Order.find({ owner: req.params.owner });
    if (orders.length) {
      return res.json(orders);
    } else if (!orders.length) {
      res.status(204).json({ msg: "Not Found Any Orders!" });
    } else {
      res.status(400).json({ msg: "You have no permission" });
    }
  }
);
router.get(
  "/getScoreOwnerSample/:owner",
  auth,
  async (req: AuthRequest, res: Response) => {
    const orders = await Order.find({ owner: req.params.owner, orderPO: 'sample' });
    if (orders.length) {
      return res.json(orders);
    } else if (!orders.length) {
      res.status(204).json({ msg: "Not Found Any Orders!" });
    } else {
      res.status(400).json({ msg: "You have no permission" });
    }
  }
);
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
  console.log("--------Scores---------", order["qScore"]);
  const updateOrder = {
    _id: req.params.orderId,
    factory: req.body.factory,
    customer: req.body.customer,
    owner: req.body.owner,
    completionDate: req.body.completionDate,
    readyDate: req.body.readyDate,
  };
  if (order) {
    const test = await Order.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.orderId) },
      updateOrder
    );
    console.log("--------------test----------",test);
    const returnOrder = {
      _id: req.params.orderId,
      userId: order.userId,
      orderPO: order.orderPO,
      factory: req.body.factory,
      customer: req.body.customer,
      owner: req.body.owner,
      completionDate: req.body.completionDate,
      readyDate: req.body.readyDate,
      qScore: order.qScore,
      cScore: order.cScore,
      pScore: order.pScore
    };
    return res.json(returnOrder);
  } else {
    return res.status(400).json({ msg: "You have no permission" });
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
