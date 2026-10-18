require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const password = await bcrypt.hash("Admin1234", 10);

  await User.deleteMany({ role: { $in: ["admin", "official"] } });

  const departments = [
    "Water Supply",
    "Electricity",
    "Street Lighting",
    "Waste Management",
    "Fire Services",
    "Public Health",
  ];

  const users = [
    {
      name: "City Admin",
      email: "admin@portal.com",
      phone: "9000000001",
      address: "Municipal Office",
      password: password,
      role: "admin",
    },
  ];

  departments.forEach(function (dept, index) {
    users.push({
      name: dept + " Official",
      email: dept.split(" ")[0].toLowerCase() + "@portal.com",
      phone: "90000001" + (10 + index),
      address: "Municipal Office",
      password: password,
      role: "official",
      department: dept,
    });
  });

  await User.create(users);

  console.log("Admin aur Officials ban gaye ✅");
  process.exit();
}

seed();