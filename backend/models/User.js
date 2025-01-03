// backend/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // ***주의: 실제 서비스에서는 해싱해야 함***
  password: {
    type: String,
    required: true,
  },
  // 사용자가 최종 확정한 plan 저장(옵션)
  finalPlan: {
    type: Object,
    default: null,
  },
});

module.exports = mongoose.model("User", UserSchema);
