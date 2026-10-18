const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    trackingId: { type: String, unique: true },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    department: { type: String, required: true },
    complaintType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    remarks: { type: String },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);