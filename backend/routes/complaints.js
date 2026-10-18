const express = require("express");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

// Citizen nayi complaint submit karega
router.post("/", protect, allowRoles("citizen"), async (req, res) => {
  try {
    const { department, complaintType, title, description, location } = req.body;

    const count = await Complaint.countDocuments();
    const trackingId = "CMP-" + (1001 + count);

    const complaint = await Complaint.create({
      trackingId: trackingId,
      citizen: req.user.id,
      department: department,
      complaintType: complaintType,
      title: title,
      description: description,
      location: location,
    });

    res.status(201).json({
      message: "Complaint submit ho gayi",
      trackingId: complaint.trackingId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Citizen apni complaints dekhega
router.get("/my", protect, allowRoles("citizen"), async (req, res) => {
  try {
    const complaints = await Complaint.find({ citizen: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Official apne department ki complaints dekhega
router.get("/department", protect, allowRoles("official"), async (req, res) => {
  try {
    const official = await User.findById(req.user.id);

    const complaints = await Complaint.find({ department: official.department })
      .populate("citizen", "name phone")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Tracking ID se complaint dekho
router.get("/track/:trackingId", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ trackingId: req.params.trackingId });
    if (!complaint) {
      return res.status(404).json({ message: "Tracking ID galat hai" });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Official/Admin: status, priority, remarks update
router.put("/:id", protect, allowRoles("official", "admin"), async (req, res) => {
  try {
    const { status, priority, remarks } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint nahi mili" });
    }

    if (status) complaint.status = status;
    if (priority) complaint.priority = priority;
    if (remarks) complaint.remarks = remarks;
    if (status === "Resolved") complaint.resolvedAt = new Date();

    await complaint.save();
    res.json({ message: "Complaint update ho gayi", complaint });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;