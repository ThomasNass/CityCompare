import { fetchAirQuality } from "../../../lib/air.js";

export default async function handler(req, res) {
  const { city, name } = req.query;
  const lauCode = Array.isArray(city) ? city[0] : city;
  const cityName = Array.isArray(name) ? name[0] : name;
  if (!lauCode) {
    return res.status(400).json({ error: "Missing city" });
  }

  try {
    const data = await fetchAirQuality(lauCode, cityName);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({ error: error.message || "Luftkvalitetsanropet misslyckades", missing: true });
  }
}
