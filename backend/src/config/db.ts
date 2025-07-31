import { connect } from "mongoose";

import { MONGO_URI } from "../constants/env";

const connectDB = async () => {
  try {
    await connect(MONGO_URI);
    console.log("Successfully connected to DB")
  } catch (err) {
    console.log("Could not connect to database", err);
    process.exit(1);
  }
};

export default connectDB;
