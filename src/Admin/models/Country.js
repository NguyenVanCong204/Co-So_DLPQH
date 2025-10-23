import Country from "../../models/Country.js";

Country.createCountry = async function (data) {
  return await this.create(data);
};

Country.getCountry = async function () {
  return await this.find();
};
export default Country;
