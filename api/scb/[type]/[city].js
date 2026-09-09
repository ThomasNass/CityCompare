import { SCB_ENDPOINTS } from "../../../lib/scb-queries.js";

export default async function handler(req, res) {
  const { type, city } = req.query;

  const endpoint = SCB_ENDPOINTS[type];
  if (!endpoint || !city) {
    return res.status(400).json({ error: "Invalid type or missing city" });
  }

  const response = await fetch(endpoint.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: endpoint.query(city),
      response: { format: "json" },
    }),
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
