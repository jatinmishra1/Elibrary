import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("databse connected successfuly");
    });
    mongoose.connection.on("error", (err) => {
      console.log("database get disconnected in between", err);
    });
    await mongoose.connect(config.dataBaseURL as string);
  } catch (err) {
    console.log(err);
    console.log("failed to connect database");
    process.exit(1);
  }
};

export default connectDB;
