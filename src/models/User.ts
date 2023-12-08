import mongoose, { Schema, Model, model, ObjectId, Date } from "mongoose";
import { hashSync, genSaltSync, compareSync } from "bcryptjs";
export interface IUser extends Document {
  firstname: string;
  lastname: string;
  company: string;
  email: string;
  password: string;
  role: string;
  status: string;
  date: Date;
  encryptPassword: (password: string) => string;
}

interface IUserModel extends Model<IUser> {}

const UserSchema: Schema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  status : {
    type: String,
  },
  date : {
    type: Date,
  }
});

UserSchema.methods.encryptPassword = (password: string) =>
  hashSync(password, genSaltSync(10));
const User: IUserModel = model<IUser, IUserModel>("User", UserSchema);

interface UserData {
  _id: ObjectId;
  firstname: string;
  lastname: string;
  company: string;
  email: string;
  password: string;
  role: string;
  status: string;
  date: Date;
}

const findUserDataByEmail = async (
  email_f: string
): Promise<UserData[]> => {
  return await User.find({
    email: email_f,
  });
};
export { findUserDataByEmail};
export default User;
