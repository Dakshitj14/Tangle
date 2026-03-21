import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  text: { type: String, required: true },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
    default: null,
  },

  createdAt: { type: Date, default: Date.now },

  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    default: null,
  },

  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],

  // ✅ FIXED: store Clerk IDs (string)
  likes: [{ type: String }],
});

const Thread =
  mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;