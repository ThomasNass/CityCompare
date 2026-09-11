import { fetchKoladaRegionCare, isKoladaPayload } from "../../../../lib/kolada.js";

export default async function handler(req, res) {
  const { id } = req.query;
  const regionId = Array.isArray(id) ? id[0] : id;
  if (!regionId) {
    return res.status(400).json({ error: "Missing region" });
  }

  try {
    const { status, data } = await fetchKoladaRegionCare(regionId);
    if (!isKoladaPayload(data)) {
      return res.status(status >= 400 ? status : 502).json(data ?? { error: "Kolada-anropet misslyckades" });
    }
    return res.status(status).json(data);
  } catch (error) {
    return res.status(502).json({ error: error.message || "Kolada-anropet misslyckades" });
  }
}
