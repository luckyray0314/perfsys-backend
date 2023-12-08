import mongoose, { Schema, Model, model, ObjectId } from "mongoose";

const OrderSchema: Schema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "order",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  orderPO: {
    type: Number,
    required: true,
  },
  customer: {
    type: String,
    required: true,
  },
  factory: {
    type: String,
    required: true,
  },
  owner : {
    type: String,
    required: true,
  },
  completionDate: {
    type: Date,
    default: Date.now,
  },
  readyDate: {
    type: Date,
    default: Date.now,
  },
  saveDate: {
    type: Date,
    default: Date.now,
  },
});

// async function findBidReportsByGroupId(groupId: number) {
//   return await BidReport.aggregate([
//     {
//       $lookup: {
//         from: "users",
//         localField: "userId",
//         foreignField: "_id",
//         as: "users",
//       },
//     },
//     {
//       $match: {
//         "users.0.groupid": groupId
//       },
//     },
//     {
//       $project: {
//         userId: 1,
//         bidCount: 1,
//         contactCount: 1,
//         chatting: 1,
//         successed: 1,
//         codeInGame: 1,
//         workingTime: 1,
//         other: 1,
//         reportdate: 1
//       }
//     }
//   ]).sort({ userId: "desc" })
//     .exec();
// }

const OrderHistory = model("OrderHistory", OrderSchema);

export default OrderHistory;

// export {
//   findBidReportsByGroupId
// }
