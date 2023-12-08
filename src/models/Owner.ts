import { Schema, model } from "mongoose";

const OwnerSchema: Schema = new Schema({
  owner: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  }
});
const Owner = model("Owner", OwnerSchema);

export default Owner;