import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  email: { type: String, unique: true },
  phone: String,
  name: String,
  price: { type: Number },
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  qualty: { type: Number },
});
const History = mongoose.model("History", historySchema);

export default History;
