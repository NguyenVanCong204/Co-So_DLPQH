import Country from "../../models/Country.js";

export const getCountry = async (req, res) => {
  const country = await Country.getCountry();
  return res.json(country);
};
