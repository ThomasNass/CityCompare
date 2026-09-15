import { fetchBathingWaters, summarizeBeaches } from "../../../lib/hav.js";

export default async function handler(req, res) {
  const { city, name } = req.query;
  const lauCode = Array.isArray(city) ? city[0] : city;
  const cityName = Array.isArray(name) ? name[0] : name;
  if (!lauCode) {
    return res.status(400).json({ error: "Missing city" });
  }

  const { status, data } = await fetchBathingWaters();
  if (status >= 400 || !Array.isArray(data)) {
    return res.status(status >= 400 ? status : 502).json(data ?? { error: "HaV-anropet misslyckades" });
  }

  return res.status(200).json(summarizeBeaches(data, lauCode, cityName));
}
