import { fetchKoladaCity } from "../../../lib/kolada.js";

export default async function handler(req, res) {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: "Missing city" });
  }

  try {
    const { status, data } = await fetchKoladaCity(city);
    if (!Array.isArray(data?.values)) {
      return res.status(status >= 400 ? status : 502).json(data ?? { error: "Kolada-anropet misslyckades" });
    }
    return res.status(status).json(data);
  } catch (error) {
    return res.status(502).json({ error: error.message || "Kolada-anropet misslyckades" });
  }
}
