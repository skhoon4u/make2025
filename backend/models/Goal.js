const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  goals: [
    {
      goalTitle: { type: String, required: true },
      targetMonth: { type: Number, required: true },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Goal", GoalSchema);
