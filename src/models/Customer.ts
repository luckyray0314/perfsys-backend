import { Schema, model } from "mongoose";

const CustomerSchema: Schema = new Schema({
  customer: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  }
});
const Customer = model("Customer", CustomerSchema);

export default Customer;