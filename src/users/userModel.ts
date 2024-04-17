import { timeStamp } from "console";
import mongoose from "mongoose";
import { User } from "./userTypes";

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function () {
  //this is technique in which basically we are trying to get the thing done
  //when .save method will be called on userSchema  we want something to be done before that ,and then this will be used
});

export default mongoose.model<User>("User", userSchema);
