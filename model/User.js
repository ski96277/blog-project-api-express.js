const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      min: 6,
    },
    // New fields for social login
    provider: {
      type: String,
      enum: ["local", "google", "facebook", "apple"],
      default: "local",
    },
    providerId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    profileImage: {
      type: String,
    },
    deviceToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Only hash password if using local auth
UserSchema.pre("save", async function (next) {
  if (this.provider !== "local") return next();

  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.matchPassword = async function (enterPassword) {
  if (this.provider !== "local") {
    // No password check for social logins
    return false;
  }
  return await bcrypt.compare(enterPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
