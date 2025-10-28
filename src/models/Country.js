import mongoose from "mongoose";
import User from "./User.js";

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
});
countrySchema.statics.createCountry = async function (data) {
  return await this.create(data);
};
countrySchema.statics.getCountry = async function () {
  return await this.find();
};
countrySchema.pre("findOneAndDelete", async function (next) {
  const countryId = this.getQuery()["_id"];
  await User.deleteMany({ id_country: countryId });
  next();
});
countrySchema.statics.deleteCountry = async function (id) {
  return await this.findOneAndDelete({ _id: id });
};
countrySchema.statics.updateCountry = async function (id, data) {
  return await this.findByIdAndUpdate(id, data, { new: true });
};

const Country = mongoose.model("Country", countrySchema);
export default Country;
