import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group"
  }]
});

const User = mongoose.model("User", UserSchema)

export default User;