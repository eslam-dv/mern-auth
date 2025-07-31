import { Document, Schema, model, Types } from "mongoose";

import VerificationCodeType from "../constants/verificationCodeTypes";

export interface IVerificationCode extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: VerificationCodeType;
  expiresAt: Date;
  createdAt: Date;
}

const verificationCodeSchema = new Schema<IVerificationCode>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
    index: true,
  },
  type: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const VerificationCodeModel = model<IVerificationCode>(
  "verificationCode",
  verificationCodeSchema,
  "verification_code",
);

export default VerificationCodeModel;
