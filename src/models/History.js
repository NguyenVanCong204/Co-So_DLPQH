import mongoose from "mongoose";
import Product from "./Product.js";
import User from "./User.js";
import mongooseDelete from "mongoose-delete";
const historySchema = new mongoose.Schema(
  {
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    id_product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: { type: Number },
    qualty: { type: Number },
    status: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
historySchema.statics.createHistory = async function (data) {
  return await this.create(data);
};
historySchema.statics.checkUser = async function (id_user) {
  const user = await User.findById(id_user);
  const error = {};
  if (!user) {
    error.user = "Người dùng không tồn tại trong hệ thống";
  }
  return error;
};
historySchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});
const History = mongoose.model("History", historySchema);

export default History;
