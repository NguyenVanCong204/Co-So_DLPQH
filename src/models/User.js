import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  id_country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    require: true,
  },
  avatar: String,
  level: { type: Number, default: 1 },
});
const User = mongoose.model("User", userSchema);

export default User;
