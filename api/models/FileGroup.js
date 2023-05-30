import mongoose from "mongoose";

const GroupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  files: [
    {
      type: mongoose.Schema.Types.Mixed, // {filename : "1223-1231231.jpg", name : "someFile.jpg", timesatmp : Date.now(), size : 5 * 1024 * 1024}
    },
  ],
}, {timestamps : true});

const Group = mongoose.model("Group", GroupSchema);

export default Group;
