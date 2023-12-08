import { Schema, model } from "mongoose";

const FactorySchema: Schema = new Schema({
  factory: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  employee: {
    type: String,
  }
});
const Factory = model("Factory", FactorySchema);

export default Factory;