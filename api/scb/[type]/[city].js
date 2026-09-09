import { SCB_ENDPOINTS } from "../../../lib/scb-queries.js";
import { fetchScbTable, isScbTable } from "../../../lib/scb-fetch.js";

export default async function handler(req, res) {
  const { type, city } = req.query;

  const endpoint = SCB_ENDPOINTS[type];
  if (!endpoint || !city) {
    return res.status(400).json({ error: "Invalid type or missing city" });
  }

  try {
    const { status, data } = await fetchScbTable(endpoint.url, endpoint.query(city));
    if (!isScbTable(data)) {
      return res.status(status >= 400 ? status : 502).json(data ?? { error: "SCB-anropet misslyckades" });
    }
    return res.status(status).json(data);
  } catch (error) {
    return res.status(502).json({ error: error.message || "SCB-anropet misslyckades" });
  }
}
