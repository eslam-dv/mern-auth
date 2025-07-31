import { Schema, model, Document, Types } from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";

export interface ISession extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

const sessionSchema = new Schema<ISession>({
  userId: { type: Schema.Types.ObjectId, ref: "user", index: true },
  userAgent: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, default: thirtyDaysFromNow() },
});

const SessionModel = model<ISession>("session", sessionSchema);
export default SessionModel;
