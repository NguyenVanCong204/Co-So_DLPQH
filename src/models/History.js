import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  email: { type: String, required: true },
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
historySchema.statics.createHistory = async function (data) {
  return await this.create(data);
};
const History = mongoose.model("History", historySchema);

export default History;
