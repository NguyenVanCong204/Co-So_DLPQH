import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
});
countrySchema.statics.createCountry = async function (data) {
  return await this.create(data);
};
countrySchema.statics.getCountry = async function () {
  return await this.find();
};

const Country = mongoose.model("Country", countrySchema);
export default Country;
