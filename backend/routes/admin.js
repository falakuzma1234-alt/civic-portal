const express = require("express");
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

router.use(protect, allowRoles("admin"));

// City-wide analytics
router.get("/stats", async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: "Pending" });
    const inProgress = await Complaint.countDocuments({ status: "In Progress" });
    const resolved = await Complaint.countDocuments({ status: "Resolved" });

    const resolvedList = await Complaint.find({ status: "Resolved", resolvedAt: { $exists: true } });
    let avgDays = 0;
    if (resolvedList.length > 0) {
      let totalMs = 0;
      resolvedList.forEach(function (c) {
        totalMs += c.resolvedAt - c.createdAt;
      });
      avgDays = (totalMs / resolvedList.length / (1000 * 60 * 60 * 24)).toFixed(1);
    }

    const byDepartment = await Complaint.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    res.json({ total, pending, inProgress, resolved, avgDays, byDepartment });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Saari complaints
router.get("/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("citizen", "name phone")
      .populate("assignedTo", "name department")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Officials ki list
router.get("/officials", async (req, res) => {
  try {
    const officials = await User.find({ role: "official" }).select("-password");
    res.json(officials);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Complaint ko official ko assign karo
router.put("/assign/:id", async (req, res) => {
  try {
    const { officialId } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint nahi mili" });
    }
    complaint.assignedTo = officialId;
    complaint.status = "Assigned";
    await complaint.save();
    res.json({ message: "Official assign ho gaya" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;