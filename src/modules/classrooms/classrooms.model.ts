import mongoose from "mongoose";
import Classroom from "./classrooms.interface";

const { ObjectId } = require("mongoose").Types;

const ClassroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  auth_id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  participants_id: [
    {
      type: ObjectId,
      ref: "user",
    },
  ],
  createTime: {
    type: Date,
    default: Date.now()
  },
});

const User = mongoose.model<Classroom & mongoose.Document>(
  "classroom",
  ClassroomSchema
);

export default User;
