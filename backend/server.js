require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Portal server chal raha hai!");
});

app.get("/api/departments", (req, res) => {
  const departments = [
    { id: 1, name: "Water Supply" },
    { id: 2, name: "Electricity" },
    { id: 3, name: "Street Lighting" },
    { id: 4, name: "Waste Management" },
  ];
  res.json(departments);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("DB error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server port " + PORT + " par chal raha hai");
});