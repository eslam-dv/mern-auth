import { Document, Schema, Types, model } from "mongoose";

import { compareValue, hashValue } from "../utils/bcrypt";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
  omitPassword: () => Pick<
    IUser,
    "_id" | "email" | "verified" | "createdAt" | "updatedAt"
  >;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false, required: true },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hashValue(this.password);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await compareValue(password, this.password);
};

userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = model<IUser>("user", userSchema);
export default UserModel;
