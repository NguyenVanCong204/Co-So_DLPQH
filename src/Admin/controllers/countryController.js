import Country from "../models/Country.js";

export const createCountry = async (req, res) => {
  const data = req.body;
  const country = await Country.createCountry(data);
  return res.json(country);
};
export const getCountry = async (req, res) => {
  const country = await Country.getCountry();
  return res.json(country);
};
